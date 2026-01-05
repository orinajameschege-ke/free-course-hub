import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# 1. Configuration - Loads all keys from GitHub Secrets
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")
rapidapi_key = os.environ.get("RAPIDAPI_KEY") # Your new secret key

supabase = create_client(url, key)

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

def scrape_coursera():
    print("--- Starting Coursera API Fetch ---")
    # Using RapidAPI for Coursera to avoid web-scraping blocks
    coursera_url = "https://coursera-course-detail.p.rapidapi.com/courses" 
    headers = {
        "x-rapidapi-key": rapidapi_key, # Pulls from your GitHub Secret
        "x-rapidapi-host": "coursera-course-detail.p.rapidapi.com"
    }
    
    try:
        # Example API call structure (update params based on your specific RapidAPI choice)
        response = requests.get(coursera_url, headers=headers, timeout=15)
        if response.status_code == 200:
            print("Successfully connected to Coursera API")
            # Logic here to parse your specific API results
    except Exception as e:
        print(f"Coursera API Error: {e}")

def scrape_udemy_api():
    print("--- Starting Udemy API Fetch ---")
    # This API provides paid Udemy courses currently available for free
    url = "https://paid-udemy-course-for-free.p.rapidapi.com/"
    headers = {
        "x-rapidapi-key": rapidapi_key, # Uses the SAME secret key
        "x-rapidapi-host": "paid-udemy-course-for-free.p.rapidapi.com"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            courses = response.json().get('course_list', [])[:5]
            for course in courses:
                course_data = {
                    "title": course['title'],
                    "url": "https://www.udemy.com" + course['url'],
                    "provider": "Udemy",
                    "category": "Coding",
                    "thumbnail_url": course.get('image_480x270', 'https://www.udemy.com/static/images/brand/logo-udemy.svg')
                }
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                print(f"Added Udemy: {course['title']}")
    except Exception as e:
        print(f"Udemy API Error: {e}")

def scrape_university_seeds():
    print("--- Syncing Ivy League Seeds ---")
    seeds = [
        {
            "title": "CS50's Intro to AI with Python",
            "url": "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python",
            "provider": "Harvard University",
            "category": "Coding",
            "thumb": "https://learning.harvard.edu/sites/default/files/styles/course_listing/public/course-images/CS50%20AI.png"
        },
        {
            "title": "MIT: Intro to Deep Learning",
            "url": "