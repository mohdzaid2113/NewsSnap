from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Importing CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@app.route('/news', methods=['GET'])
def get_news():
    query = request.args.get('q', default='latest', type=str)  # Default to 'latest' if no query is provided
    url = f'https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}'
    
    try:
        response = requests.get(url)
        data = response.json()

        # Filter out articles that are marked as "[Removed]" in title, description, or content
        filtered_articles = [
            article for article in data.get('articles', [])
            if article.get('title') and article.get('url') and article.get('content')
            and "[Removed]" not in article.get('title', '')
            and "[Removed]" not in article.get('description', '')
            and "[Removed]" not in article.get('content', '')
        ]

        # Return only the filtered articles to the frontend
        return jsonify({'articles': filtered_articles})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
