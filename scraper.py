import os
import requests
from supabase import create_client

# 1. Configuration
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(supabase_url, supabase_key)

def get_category(title_lower):
    """Categorization logic for all 11 categories"""
    if any(word in title_lower for word in ["cyber", "security", "hacking", "pentest"]):
        return "Cybersecurity"
    elif any(word in title_lower for word in ["cloud", "aws", "azure", "devops"]):
        return "Cloud Computing"
    elif any(word in title_lower for word in ["data science", "analysis", "sql", "tableau"]):
        return "Data"
    elif any(word in title_lower for word in ["cook", "chef", "recipe", "baking", "culinary", "kitchen"]):
        return "Chef"
    elif any(word in title_lower for word in ["code", "python", "javascript", "react", "programming"]):
        return "Coding"
    elif any(word in title_lower for word in ["ai", "machine learning", "chatgpt"]):
        return "AI Tools"
    elif any(word in title_lower for word in ["marketing", "seo", "ads", "social media"]):
        return "Marketing"
    elif any(word in title_lower for word in ["design", "ui", "ux", "figma", "graphic"]):
        return "Design"
    elif any(word in title_lower for word in ["business", "finance", "management", "excel"]):
        return "Business"
    return "General Learning"

def scrape_youtube(query, count=100):
    """Fetches specific batches of courses"""
    print(f"Syncing {count} courses for query: {query}")
    base_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "maxResults": count if count <= 50 else 50,
        "q": query,
        "type": "video",
        "key": youtube_api_key
    }
    
    try:
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            items = response.json().get("items", [])
            for item in items:
                title = item["snippet"]["title"]
                course_data = {
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": get_category(title.lower()),
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                # Prevents duplicates via URL unique constraint
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
            print(f"Successfully processed batch for {query}")
    except Exception as e:
        print(f"Batch failed: {e}")

if __name__ == "__main__":
    # Split the 400 target into dedicated searches to ensure category depth
    scrape_youtube("Full free technical courses 2026", 150)
    scrape_youtube("Professional Chef and Cooking courses full", 50)
    scrape_youtube("Cybersecurity and Cloud Computing full courses", 125)
    scrape_youtube("Business Marketing and Design full courses", 75)
    print("--- 400 Course Sync Complete ---")