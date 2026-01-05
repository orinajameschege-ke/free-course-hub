import os
import requests
from supabase import create_client

# 1. Configuration - Loads secrets from GitHub environment
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")
rapidapi_key = os.environ.get("RAPIDAPI_KEY") # New secret key

supabase = create_client(supabase_url, supabase_key)

def scrape_youtube():
    print("--- Starting YouTube Scrape ---")
    search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=Free+AI+Course+2026&type=video&key={youtube_api_key}"
    try:
        response = requests.get(search_url).json()
        for item in response.get("items", []):
            course_data = {
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "provider": "YouTube",
                "category": "AI Tools",
                "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
            }
            supabase.table("courses").upsert(course_data, on_conflict="url").execute()
            print(f"Added YouTube: {item['snippet']['title']}")
    except Exception as e:
        print(f"YouTube Error: {e}")

def scrape_udemy_api():
    print("--- Fetching Udemy via RapidAPI ---")
    # This specific endpoint is designed for free course discovery
    url = "https://paid-udemy-course-for-free.p.rapidapi.com/"
    headers = {
        "x-rapidapi-key": rapidapi_key,
        "x-rapidapi-host": "paid-udemy-course-for-free.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params={"page": "1"}, timeout=15)
        if response.status_code == 200:
            courses = response.json().get('course_list', [])[:5]
            for course in courses:
                data = {
                    "title": course['title'],
                    "url": "https://www.udemy.com" + course['url'],
                    "provider": "Udemy",
                    "category": "Coding",
                    "thumbnail_url": course.get('image_480x270')
                }
                supabase.table("courses").upsert(data, on_conflict="url").execute()
                print(f"Added Udemy: {course['title']}")
    except Exception as e:
        print(f"Udemy API Error: {e}")

def scrape_coursera_api():
    print("--- Fetching Coursera via RapidAPI ---")
    # Using the detail API to bypass web scraping blocks
    url = "https://coursera-course-detail.p.rapidapi.com/courses" 
    headers = {
        "x-rapidapi-key": rapidapi_key,
        "x-rapidapi-host": "coursera-course-detail.p.rapidapi.com"
    }
    try:
        # Example API call; adjust parameters based on your specific subscription
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            print("Successfully connected to Coursera API")
            # Coursera data parsing logic goes here
    except Exception as e:
        print(f"Coursera API Error: {e}")

def scrape_university_seeds():
    print("--- Syncing Ivy League Seeds ---")
    # Guaranteed high-quality content to build site authority
    seeds = [
        {"title": "CS50's Intro to AI with Python", "url": "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python", "provider": "Harvard University", "category": "Coding", "thumb": "https://learning.harvard.edu/sites/default/files/styles/course_listing/public/course-images/CS50%20AI.png"},
        {"title": "MIT: Intro to Deep Learning", "url": "https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2023/", "provider": "MIT", "category": "Coding", "thumb": "https://ocw.mit.edu/static/images/ocw_logo_orange.png"}
    ]
    for course in seeds:
        data = {"title": course["title"], "url": course["url"], "provider": course["provider"], "category": course["category"], "thumbnail_url": course["thumb"]}
        supabase.table("courses").upsert(data, on_conflict="url").execute()
        print(f"Synced Seed: {course['title']}")

if __name__ == "__main__":
    scrape_youtube()
    scrape_udemy_api()
    scrape_coursera_api()
    scrape_university_seeds()