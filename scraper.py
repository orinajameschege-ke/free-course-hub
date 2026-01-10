import os
import requests
import re # Added for cleaning titles
from supabase import create_client

# Configuration
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(supabase_url, supabase_key)

def get_category(title_lower):
    if any(word in title_lower for word in ["cyber", "security", "hacking", "pentest"]):
        return "Cybersecurity"
    elif any(word in title_lower for word in ["cloud", "aws", "azure", "devops"]):
        return "Cloud Computing"
    elif any(word in title_lower for word in ["data science", "analysis", "sql", "tableau"]):
        return "Data"
    elif any(word in title_lower for word in ["cook", "chef", "recipe", "baking", "culinary"]):
        return "Chef"
    elif any(word in title_lower for word in ["code", "python", "javascript", "react", "programming"]):
        return "Coding"
    elif any(word in title_lower for word in ["ai", "machine learning", "chatgpt"]):
        return "AI Tools"
    elif any(word in title_lower for word in ["marketing", "seo", "ads"]):
        return "Marketing"
    elif any(word in title_lower for word in ["design", "ui", "ux", "figma"]):
        return "Design"
    elif any(word in title_lower for word in ["business", "finance", "management"]):
        return "Business"
    return "General Learning"

def scrape_youtube(query, count=100):
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
                raw_title = item["snippet"]["title"]
                
                # CLEANING STEP: Remove emojis/symbols for better SEO
                clean_title = re.sub(r'[^\w\s-]', '', raw_title)
                
                course_data = {
                    "title": clean_title,
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "provider": "YouTube",
                    "category": get_category(clean_title.lower()),
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                # Upsert prevents duplicate links
                supabase.table("courses").upsert(course_data, on_conflict="url").execute()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Multi-search strategy to ensure all categories fill up
    scrape_youtube("Full free technical courses 2026", 175)
    scrape_youtube("Professional Chef and Culinary courses full", 75)
    scrape_youtube("Cybersecurity and Cloud Computing full courses", 150)
    scrape_youtube("Marketing and Business Management courses", 100)
