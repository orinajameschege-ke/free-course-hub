import os
import requests
from supabase import create_client

# 1. Configuration - Loads secrets from GitHub environment
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(supabase_url, supabase_key)

def scrape_youtube_multi_page(max_total=100):
    print(f"--- Starting YouTube Scrape (Target: {max_total} courses) ---")
    search_query = "Free full courses"
    base_url = "https://www.googleapis.com/youtube/v3/search"
    
    total_added = 0
    next_page_token = None
    
    while total_added < max_total:
        params = {
            "part": "snippet",
            "maxResults": 50,
            "q": search_query,
            "type": "video",
            "key": youtube_api_key,
            "pageToken": next_page_token
        }
        
        try:
            response = requests.get(base_url, params=params)
            # LOGGING: Print the status to see if GitHub is being blocked
            print(f"DEBUG: YouTube API Response Status Code: {response.status_code}")
            
            if response.status_code != 200:
                # This will show if you hit your 10,000 unit daily quota
                print(f"ERROR DETAILS: {response.text}")
                break
                
            data = response.json()
            items = data.get("items", [])
            
            if not items:
                print("DEBUG: No items found in the current page.")
                break
                
            for item in items:
                title = item["snippet"]["title"]
                category = "General Learning"
                if any(word in title.lower() for word in ["code", "python", "javascript", "programming"]):
                    category = "Coding"
                elif any(word in title.lower() for word in ["ai", "machine learning", "chatgpt"]):
                    category = "AI Tools"

                course_data = {
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": category,
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                
                # Verify data is sending to Supabase
                try:
                    supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                    total_added += 1
                except Exception as db_err:
                    print(f"DATABASE ERROR: Failed to add '{title}': {db_err}")

                if total_added >= max_total:
                    break
            
            next_page_token = data.get("nextPageToken")
            if not next_page_token:
                print("DEBUG: No more pages available.")
                break
                
            print(f"PROGRESS: Currently synced {total_added} courses...")
            
        except Exception as e:
            print(f"SYSTEM CRASH: {e}")
            break
            
    print(f"--- Finished! Successfully synced {total_added} YouTube courses ---")

if __name__ == "__main__":
    scrape_youtube_multi_page(100)