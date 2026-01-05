
import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# 1. Configuration - Uses your GitHub Secrets
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

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
    print("--- Starting Coursera Scrape ---")
    # Coursera search for free courses
    coursera_url = "https://www.coursera.org/search?query=free%20ai"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
    try:
        response = requests.get(coursera_url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Target Coursera's specific card title class
        cards = soup.select('.cds-119.cds-CommonCard-title')[:5]
        
        for card in cards:
            title = card.text.strip()
            parent_link = card.find_parent('a')
            if parent_link:
                course_data = {
                    "title": title,
                    "url": "https://www.coursera.org" + parent_link['href'],
                    "provider": "Coursera",
                    "category": "AI Tools",
                    "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Coursera_logo.png"
                }
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                print(f"Added Coursera: {title}")
    except Exception as e:
        print(f"Coursera Scrape Error: {e}")

def scrape_udemy_free():
    print("--- Starting Udemy Scrape ---")
    # Searching for Udemy free AI courses
    udemy_url = "https://www.udemy.com/courses/search/?q=free+ai&price=price-free&sort=relevance"
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
    
    try:
        response = requests.get(udemy_url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Udemy cards often use h3 for titles
        course_titles = soup.select('h3[data-purpose="course-title-url"]')[:5]
        
        for title_el in course_titles:
            title = title_el.text.strip()
            link = title_el.find('a')['href']
            course_data = {
                "title": title,
                "url": "https://www.udemy.com" + link,
                "provider": "Udemy",
                "category": "Coding",
                "thumbnail_url": "https://www.udemy.com/static/images/brand/logo-udemy.svg"
            }
            supabase.table("courses").upsert(course_data, on_conflict="url").execute()
            print(f"Added Udemy: {title}")
    except Exception as e:
        print(f"Udemy Scrape Error: {e}")

def scrape_university_seeds():
    print("--- Syncing Ivy League Seeds ---")
    # Guaranteed high-quality content to build site authority
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
            "url": "https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2023/",
            "provider": "MIT",
            "category": "Coding",
            "thumb": "https://ocw.mit.edu/static/images/ocw_logo_orange.png"
        }
    ]
    for course in seeds:
        data = {
            "title": course["title"],
            "url": course["url"],
            "provider": course["provider"],
            "category": course["category"],
            "thumbnail_url": course["thumb"]
        }
        supabase.table("courses").upsert(data, on_conflict="url").execute()
        print(f"Synced Seed: {course['title']}")

if __name__ == "__main__":
    scrape_youtube()
    scrape_coursera()
    scrape_udemy_free()
    scrape_university_seeds()