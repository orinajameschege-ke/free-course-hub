import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# 1. Configuration (KEEP THIS)
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(url, key)

# 2. YouTube Scraper (KEEP THIS - IT WORKS)
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

# 3. MIT Scraper (REPLACED WITH NEW FALLBACK LOGIC)
def scrape_mit_university():
    print("--- Starting MIT University Scrape ---")
    mit_url = "https://ocw.mit.edu/search/?t=Artificial%20Intelligence"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(mit_url, headers=headers, timeout=20)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Target reliable class for MIT course titles
            course_items = soup.find_all('div', class_='course-card-title')[:5]
            
            # Fallback logic if the specific div isn't found
            if not course_items:
                course_items = [a for a in soup.find_all('a', href=True) if '/courses/' in a['href']][:5]

            for item in course_items:
                link = item if item.name == 'a' else item.find('a')
                if link:
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

# 4. Main Execution (RUNS BOTH)
if __name__ == "__main__":
    scrape_youtube()
    scrape_mit_university()