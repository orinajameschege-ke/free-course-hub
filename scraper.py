
import os
import requests
from supabase import create_client

# Configuration
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
youtube_api_key = os.environ.get("YOUTUBE_API_KEY")

supabase = create_client(url, key)

def scrape_youtube():
    print("--- Starting YouTube Scrape ---")
    search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=Free+AI+Course+2026&type=video&key={youtube_api_key}"
    try:
        response = requests.get(search_url).json()
        for item in response.get("items", []):
            course_data = {
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "provider": "YouTube",
                "category": "AI Tools",
                "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
            }
            supabase.table("courses").upsert(course_data, on_conflict="url").execute()
            print(f"Added YouTube: {item['snippet']['title']}")
    except Exception as e:
        print(f"YouTube Error: {e}")

def scrape_harvard_and_mit():
    print("--- Starting University Scrape ---")
    # We use a curated list of top Ivy League AI courses to ensure 100% reliability
    university_courses = [
        {
            "title": "CS50's Introduction to Artificial Intelligence with Python",
            "url": "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python",
            "provider": "Harvard University",
            "category": "Coding",
            "thumb": "https://learning.harvard.edu/sites/default/files/styles/course_listing/public/course-images/CS50%20AI.png"
        },
        {
            "title": "Data Science: Machine Learning",
            "url": "https://pll.harvard.edu/course/data-science-machine-learning",
            "provider": "Harvard University",
            "category": "AI Tools",
            "thumb": "https://learning.harvard.edu/sites/default/files/styles/course_listing/public/course-images/DS_MachineLearning.png"
        },
        {
            "title": "MIT: Introduction to Deep Learning",
            "url": "https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2023/",
            "provider": "MIT",
            "category": "Coding",
            "thumb": "https://ocw.mit.edu/static/images/ocw_logo_orange.png"
        }
    ]

    for course in university_courses:
        try:
            course_data = {
                "title": course["title"],
                "url": course["url"],
                "provider": course["provider"],
                "category": course["category"],
                "thumbnail_url": course["thumb"]
            }
            supabase.table("courses").upsert(course_data, on_conflict="url").execute()
            print(f"Added {course['provider']}: {course['title']}")
        except Exception as e:
            print(f"Error adding {course['title']}: {e}")

if __name__ == "__main__":
    scrape_youtube()
    scrape_harvard_and_mit()