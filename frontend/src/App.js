import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Step 1: Set a default value of an empty array for `news`
  const [news, setNews] = useState([]);

  // Step 2: Fetch news data from your backend API
  useEffect(() => {
    axios.get('/api/news')  // Make sure this endpoint is correct
      .then(response => {
        // Step 3: Ensure the response has a valid articles array or default to an empty array
        setNews(response.data.articles || []);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  }, []);

  return (
    <div>
      <h1>News Feed</h1>
      
      {/* Step 4: Conditionally render the news articles or show a loading message */}
      {news && news.length > 0 ? (
        news.map((article, index) => (
          <div key={index} className="news-card">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </div>
        ))
      ) : (
        <p>Loading news...</p>  // Displayed when `news` is empty or still loading
      )}
    </div>
  );
}

export default App;
