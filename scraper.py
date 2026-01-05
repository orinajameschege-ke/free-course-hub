import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# Initialize Supabase Client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(url, key)

def scrape_youtube():
    print("--- Starting YouTube Scrape ---")
    search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=Free+AI+Course+2026&type=video&key={youtube_api_key}"
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

def scrape_mit_university():
    print("--- Starting MIT University Scrape ---")
    mit_url = "https://ocw.mit.edu/search/?q=artificial+intelligence"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(mit_url, headers=headers, timeout=15)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            # Select the course links specifically from MIT's structure
            course_links = soup.select('a.course-link')[:5] 
            
            for link in course_links:
                title = link.text.strip()
                full_url = "https://ocw.mit.edu" + link['href']
                
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
            print(f"MIT access denied: Status {response.status_code}")
    except Exception as e:
        print(f"MIT Scrape Error: {e}")

if __name__ == "__main__":
    scrape_youtube()
    scrape_mit_university()