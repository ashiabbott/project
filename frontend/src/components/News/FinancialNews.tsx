import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NewspaperIcon } from '@heroicons/react/24/outline';

const FinancialNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/everything?q=finance&apiKey=YOUR_NEWS_API_KEY'
        );
        setNews(response.data.articles);
      } catch (err) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading news...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Financial News</h2>
      <ul>
        {news.map((article, index) => (
          <li key={index} className="mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-500">{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialNews;
