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
            response = requests.get(base_url, params=params).json()
            items = response.get("items", [])
            
            for item in items:
                title = item["snippet"]["title"].lower()
                
                # Logic to map YouTube titles to your website headers
                if any(word in title for word in ["code", "python", "javascript", "programming"]):
                    category = "Coding"
                elif any(word in title for word in ["ai", "machine learning", "chatgpt", "intelligence"]):
                    category = "AI Tools"
                elif any(word in title for word in ["marketing", "seo", "ads", "social media"]):
                    category = "Marketing"
                elif any(word in title for word in ["design", "ui", "ux", "photoshop", "figma"]):
                    category = "Design"
                elif any(word in title for word in ["business", "finance", "startup", "management"]):
                    category = "Business"
                else:
                    category = "General Learning" # Fallback category

                course_data = {
                    "title": item["snippet"]["title"],
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": category,
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
                total_added += 1
                if total_added >= max_total: break
            
            next_page_token = response.get("nextPageToken")
            if not next_page_token: break
                
        except Exception as e:
            print(f"Scrape Error: {e}")
            break
            
    print(f"Finished! Synced {total_added} courses across categories.")