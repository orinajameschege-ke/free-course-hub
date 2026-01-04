import os
import requests
from supabase import create_client

# Setup keys (these will be stored safely in GitHub)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
YT_API_KEY = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def scrape_youtube_ai():
    search_query = "free AI tool course 2026" # Looking for the latest tools
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q={search_query}&type=video&key={YT_API_KEY}"
    
    response = requests.get(url).json()
    
    for item in response.get('items', []):
        course_data = {
            "title": item['snippet']['title'],
            "provider": "YouTube",
            "category": "AI Tools",
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            "thumbnail_url": item['snippet']['thumbnails']['high']['url'],
            "description": item['snippet']['description']
        }
        
        # Insert into Supabase (it will skip if duplicate URL is set up)
        supabase.table("courses").insert(course_data).execute()
        print(f"Added: {course_data['title']}")

if __name__ == "__main__":
    scrape_youtube_ai()