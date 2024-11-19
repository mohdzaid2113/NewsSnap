import React, { useState, useEffect } from 'react';
import './App.css';
import NewsCard from './components/NewsCard';
import SearchBar from './components/SearchBar';

const App = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('latest');

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/news?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Always use the articles array from the response, even if it's empty
      setNews(data.articles || []);
      
      // Set error if one was returned
      if (data.error) {
        setError(data.error);
      }
      
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [query]);

  return (
    <div className="app">
      <header className="app-header">
        <img src="/logo.png" alt="NewsSnap Logo" className="app-logo" />
        <h1>NewsSnap</h1>
      </header>
      
      <SearchBar onSearch={setQuery} />
      
      {loading && (
        <div className="loading-message">
          <p>Loading news...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="news-list">
        {!loading && !error && news.length > 0 ? (
          news.map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} />
          ))
        ) : !loading && !error ? (
          <div className="no-results">
            <p>No news articles found. Please try a different search term.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;