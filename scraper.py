
import os
import requests
from supabase import create_client

# 1. Setup - uses your existing GitHub Secrets
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

def scrape_mit_university():
    print("--- Starting MIT University Scrape ---")
    # Using the direct search API for better reliability
    mit_api_url = "https://ocw.mit.edu/search/api/v1/courses/?q=artificial+intelligence"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://ocw.mit.edu/"
    }
    
    try:
        response = requests.get(mit_api_url, headers=headers, timeout=20)
        
        if response.status_code == 200:
            data = response.json()
            # MIT results are usually nested in a 'results' key
            courses = data.get('results', [])[:5]
            
            for course in courses:
                title = course.get('title')
                full_url = "https://ocw.mit.edu" + course.get('url')
                
                course_data = {
                    "title": title,
                    "url": full_url,
                    "provider": "MIT OpenCourseWare",
                    "category": "Coding",
                    "thumbnail_url": "https://ocw.mit.edu/static/images/ocw_logo_orange.png"
                }
                
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                print(f"Added MIT: {title}")
        else:
            print(f"MIT API Access Denied: Status {response.status_code}")
            
    except Exception as e:
        print(f"MIT Scrape Error: {e}")

if __name__ == "__main__":
    scrape_youtube()
    scrape_mit_university()