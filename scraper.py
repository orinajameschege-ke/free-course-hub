import os
import requests
from supabase import create_client

# 1. Configuration
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(supabase_url, supabase_key)

def scrape_youtube_multi_page(max_total=200): # Increased to 200 for more variety
    print(f"--- Starting YouTube Scrape (Target: {max_total}) ---")
    search_query = "Full free courses for beginners 2026"
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
            if response.status_code != 200:
                print(f"API Error: {response.text}")
                break
                
            data = response.json()
            items = data.get("items", [])
            
            for item in items:
                title_full = item["snippet"]["title"]
                title_lower = title_full.lower()
                
                # 2. Advanced Keyword Mapping
                if any(word in title_lower for word in ["cyber", "security", "hacking", "pentest"]):
                    category = "Cybersecurity"
                elif any(word in title_lower for word in ["cloud", "aws", "azure", "devops"]):
                    category = "Cloud Computing"
                elif any(word in title_lower for word in ["data science", "analysis", "sql", "tableau"]):
                    category = "Data"
                elif any(word in title_lower for word in ["cook", "chef", "recipe", "baking"]):
                    category = "Cooking"
                elif any(word in title_lower for word in ["code", "python", "javascript", "react"]):
                    category = "Coding"
                elif any(word in title_lower for word in ["ai", "machine learning", "chatgpt"]):
                    category = "AI Tools"
                elif any(word in title_lower for word in ["marketing", "seo", "ads"]):
                    category = "Marketing"
                elif any(word in title_lower for word in ["design", "ui", "ux", "figma"]):
                    category = "Design"
                elif any(word in title_lower for word in ["business", "finance", "excel"]):
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
                
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                total_added += 1
                if total_added >= max_total: break
            
            next_page_token = data.get("nextPageToken")
            if not next_page_token: break
            
        except Exception as e:
            print(f"Error: {e}")
            break
            
    print(f"Done! Synced {total_added} courses.")

if __name__ == "__main__":
    scrape_youtube_multi_page(200)