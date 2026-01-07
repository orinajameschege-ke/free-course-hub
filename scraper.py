import os
import requests
from supabase import create_client

# 1. Configuration - Loads secrets from GitHub environment
# Ensure these names match your GitHub Secrets exactly
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(supabase_url, supabase_key)

def scrape_youtube_multi_page(max_total=100):
    print(f"--- Starting YouTube Scrape (Target: {max_total} courses) ---")
    # Broad query to capture all free courses, with or without certificates
    search_query = "Free full courses"
    base_url = "https://www.googleapis.com/youtube/v3/search"
    
    total_added = 0
    next_page_token = None
    
    # Pagination loop to fetch more than the standard 50-result limit
    while total_added < max_total:
        params = {
            "part": "snippet",
            "maxResults": 50, # Maximum allowed per page by YouTube API
            "q": search_query,
            "type": "video",
            "key": youtube_api_key,
            "pageToken": next_page_token # Moves to the next set of results
        }
        
        try:
            response = requests.get(base_url, params=params).json()
            items = response.get("items", [])
            
            if not items:
                print("No more items found.")
                break
                
            for item in items:
                title = item["snippet"]["title"]
                
                # Dynamic category labeling based on title keywords
                category = "General Learning"
                if any(word in title.lower() for word in ["code", "python", "javascript", "web dev", "programming"]):
                    category = "Coding"
                elif any(word in title.lower() for word in ["ai", "machine learning", "data science", "chatgpt"]):
                    category = "AI Tools"

                course_data = {
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": category,
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                
                # Upsert updates the row if the URL already exists
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                total_added += 1
                
                # Exit loop early if we hit the target mid-page
                if total_added >= max_total:
                    break
            
            # Retrieve the token for the next page
            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                print("End of YouTube search results.")
                break
                
            print(f"Status: {total_added}/{max_total} courses synced...")
            
        except Exception as e:
            print(f"YouTube Scrape Error: {e}")
            break
            
    print(f"Finished! Successfully added/updated {total_added} courses.")

if __name__ == "__main__":
    # Runs ONLY the YouTube scraper
    scrape_youtube_multi_page(100)