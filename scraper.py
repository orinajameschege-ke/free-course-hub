import os
import requests
from supabase import create_client

# 1. Configuration
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(supabase_url, supabase_key)

def scrape_youtube_multi_page(max_total=100):
    print(f"--- Starting YouTube Scrape (Target: {max_total} courses) ---")
    # Broad query to capture a wide variety of subjects
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
            print(f"DEBUG: YouTube API Response Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"ERROR DETAILS: {response.text}")
                break
                
            data = response.json()
            items = data.get("items", [])
            
            for item in items:
                title_full = item["snippet"]["title"]
                title_lower = title_full.lower()
                
                # 2. Logic to map titles to your website headers
                if any(word in title_lower for word in ["code", "python", "javascript", "programming", "react", "html"]):
                    category = "Coding"
                elif any(word in title_lower for word in ["ai", "machine learning", "chatgpt", "intelligence", "automation"]):
                    category = "AI Tools"
                elif any(word in title_lower for word in ["marketing", "seo", "ads", "social media", "content creator"]):
                    category = "Marketing"
                elif any(word in title_lower for word in ["design", "ui", "ux", "photoshop", "figma", "graphic"]):
                    category = "Design"
                elif any(word in title_lower for word in ["business", "finance", "startup", "management", "excel", "economics"]):
                    category = "Business"
                else:
                    category = "General Learning"

                course_data = {
                    "title": title_full,
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": category,
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                
                try:
                    # Upsert uses the unique URL constraint we set in SQL
                    supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                    total_added += 1
                except Exception as db_err:
                    print(f"DATABASE ERROR adding '{title_full}': {db_err}")

                if total_added >= max_total:
                    break
            
            next_page_token = data.get("nextPageToken")
            if not next_page_token:
                break
                
            print(f"PROGRESS: Synced {total_added} courses...")
            
        except Exception as e:
            print(f"SYSTEM CRASH: {e}")
            break
            
    print(f"--- Finished! Successfully synced {total_added} YouTube courses ---")

if __name__ == "__main__":
    scrape_youtube_multi_page(100)