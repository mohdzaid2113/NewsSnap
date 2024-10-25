import React, { useState, useEffect } from 'react';
import './App.css';
import NewsCard from './components/NewsCard';
import SearchBar from './components/SearchBar';

const App = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState('latest');

  const fetchNews = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/news?q=${query}`);
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
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
      <div className="news-list">
        {news.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default App;
