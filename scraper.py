import os
import requests
from supabase import create_client

# 1. Configuration - Loads secrets from GitHub environment
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")
rapidapi_key = os.environ.get("RAPIDAPI_KEY")

supabase = create_client(supabase_url, supabase_key)

def scrape_youtube_multi_page(max_total=100):
    print(f"--- Starting YouTube Scrape (Target: {max_total} courses) ---")
    search_query = "Free full courses"
    base_url = "https://www.googleapis.com/youtube/v3/search"
    
    total_added = 0
    next_page_token = None
    
    # Pagination loop to fetch more than 50 results
    while total_added < max_total:
        params = {
            "part": "snippet",
            "maxResults": 50, # Max allowed per page
            "q": search_query,
            "type": "video",
            "key": youtube_api_key,
            "pageToken": next_page_token
        }
        
        try:
            response = requests.get(base_url, params=params).json()
            items = response.get("items", [])
            
            if not items:
                break
                
            for item in items:
                title = item["snippet"]["title"]
                # Dynamic category labeling
                category = "General Learning"
                if any(word in title.lower() for word in ["code", "python", "javascript", "web dev"]):
                    category = "Coding"
                elif any(word in title.lower() for word in ["ai", "machine learning", "data science"]):
                    category = "AI Tools"

                course_data = {
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": category,
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                total_added += 1
                
            # Check if there is another page
            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break
                
            print(f"Fetched {total_added} courses so far...")
            
        except Exception as e:
            print(f"YouTube Pagination Error: {e}")
            break
            
    print(f"Finished! Added {total_added} YouTube courses.")

def scrape_university_seeds():
    print("--- Syncing Ivy League Seeds ---")
    seeds = [
        {"title": "CS50's Intro to AI", "url": "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python", "provider": "Harvard", "category": "Coding", "thumb": "https://learning.harvard.edu/sites/default/files/styles/course_listing/public/course-images/CS50%20AI.png"},
        {"title": "MIT Deep Learning", "url": "https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2023/", "provider": "MIT", "category": "Coding", "thumb": "https://ocw.mit.edu/static/images/ocw_logo_orange.png"}
    ]
    for course in seeds:
        data = {"title": course["title"], "url": course["url"], "provider": course["provider"], "category": course["category"], "thumbnail_url": course["thumb"]}
        supabase.table("courses").upsert(data, on_conflict="url").execute()

if __name__ == "__main__":
    scrape_youtube_multi_page(100) # Now targets 100 courses
    scrape_university_seeds()