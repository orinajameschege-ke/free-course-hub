import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# Initialize Supabase Client using your GitHub Secrets
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(url, key)

def scrape_youtube():
    print("--- Starting YouTube Scrape ---")
    # This searches YouTube for "Free AI Course 2026"
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
        # Upsert prevents duplicate entries by checking the URL
        supabase.table("courses").upsert(course_data, on_conflict="url").execute()
    print("YouTube Scrape Finished.")

def scrape_mit_university():
    print("--- Starting MIT University Scrape ---")
    # Targeted search for AI courses on MIT OpenCourseWare
    mit_url = "https://ocw.mit.edu/search/?t=Artificial%20Intelligence"
    headers = {"User-Agent": "Mozilla/5.0"} # Pretend to be a browser for access
    
    response = requests.get(mit_url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # MIT uses specific classes for their course cards
        course_cards = soup.find_all('div', class_='course-card')[:5] 
        
        for card in course_cards:
            title_element = card.find('h3')
            link_element = card.find('a')
            
            if title_element and link_element:
                course_data = {
                    "title": title_element.text.strip(),
                    "url": "https://ocw.mit.edu" + link_element['href'],
                    "provider": "MIT OpenCourseWare",
                    "category": "Coding",
                    "thumbnail_url": "https://ocw.mit.edu/static/images/ocw_logo_orange.png"
                }
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
    print("MIT Scrape Finished.")

if __name__ == "__main__":
    # This main block calls both scrapers one after the other
    try:
        scrape_youtube()
    except Exception as e:
        print(f"YouTube Error: {e}")
        
    try:
        scrape_mit_university()
    except Exception as e:
        print(f"University Error: {e}")