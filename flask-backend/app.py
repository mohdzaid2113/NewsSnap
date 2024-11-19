from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@app.route('/news', methods=['GET'])
def get_news():
    # Validate API key
    if not NEWS_API_KEY:
        logger.error("NEWS_API_KEY not found in environment variables")
        return jsonify({
            'error': 'API key not configured',
            'articles': []  # Always include an empty articles array
        }), 500

    query = request.args.get('q', default='latest', type=str)
    url = f'https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}&language=en'
    
    try:
        # Make the API request
        response = requests.get(url)
        response.raise_for_status()  # This will raise an exception for bad status codes
        
        data = response.json()
        
        # Check if we have articles in the response
        if 'articles' not in data:
            logger.error(f"No articles found in API response: {data}")
            return jsonify({
                'error': 'No articles found in API response',
                'articles': []  # Always include an empty articles array
            }), 500

        # Filter out invalid articles
        filtered_articles = [
            article for article in data['articles']
            if article.get('title') and article.get('url')
            and not any("[Removed]" in str(article.get(field, '')) 
                       for field in ['title', 'description', 'content'])
        ]

        logger.info(f"Found {len(filtered_articles)} valid articles")
        
        return jsonify({
            'success': True,
            'articles': filtered_articles,
            'total': len(filtered_articles)
        })

    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {str(e)}")
        return jsonify({
            'error': f"Failed to fetch news: {str(e)}",
            'articles': []  # Always include an empty articles array
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': f"An unexpected error occurred: {str(e)}",
            'articles': []  # Always include an empty articles array
        }), 500

if __name__ == '__main__':
    app.run(debug=True)