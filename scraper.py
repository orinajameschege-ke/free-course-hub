def scrape_all_categories():
    # Define a variety of categories to search for
    categories = {
        "AI Tools": "free AI tool course 2026",
        "Coding": "web development for beginners full course",
        "Marketing": "digital marketing complete tutorial free",
        "Design": "graphic design basics course for beginners",
        "Business": "entrepreneurship and startup 101 course"
    }

    for category, query in categories.items():
        print(f"Hunting for: {category}")
        # (Your existing YouTube API request code goes here using 'query')
        
        # When saving to Supabase, include the category name
        supabase.table("courses").upsert({
            "title": video_title,
            "url": video_url,
            "category": category, # Save the category found!
            "provider": "YouTube",
            "thumbnail_url": thumb_url
        }, on_conflict='url').execute()