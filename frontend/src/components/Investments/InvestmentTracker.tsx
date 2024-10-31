import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStockQuote, getCompanyNews } from '../../services/finnhubService';
import { analyzeInvestment } from '../../services/openAIService';
import { predictMarketTrends } from '../../services/ollamaService';

interface Investment {
  symbol: string;
  shares: number;
}

const InvestmentTracker: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [newInvestment, setNewInvestment] = useState({
    symbol: '',
    shares: '',
  });
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [stockData, setStockData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [news, setNews] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<string>('');

  useEffect(() => {
    if (selectedInvestment) {
      fetchStockData(selectedInvestment.symbol);
      fetchAnalysis(selectedInvestment.symbol);
      fetchNews(selectedInvestment.symbol);
      fetchPrediction(selectedInvestment.symbol);
    }
  }, [selectedInvestment]);

  const fetchStockData = async (symbol: string) => {
    try {
      const data = await getStockQuote(symbol);
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const fetchAnalysis = async (symbol: string) => {
    try {
      const data = await analyzeInvestment(symbol);
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching investment analysis:', error);
    }
  };

  const fetchNews = async (symbol: string) => {
    try {
      const today = new Date();
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const data = await getCompanyNews(
        symbol,
        oneMonthAgo.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );
      setNews(data.slice(0, 5)); // Get the latest 5 news items
    } catch (error) {
      console.error('Error fetching company news:', error);
    }
  };

  const fetchPrediction = async (symbol: string) => {
    try {
      const data = await predictMarketTrends({ symbol });
      setPrediction(data);
    } catch (error) {
      console.error('Error fetching market prediction:', error);
    }
  };

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const investment: Investment = {
      symbol: newInvestment.symbol.toUpperCase(),
      shares: parseInt(newInvestment.shares),
    };
    setInvestments([...investments, investment]);
    setNewInvestment({ symbol: '', shares: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background-light bg-opacity-10 shadow-lg rounded-lg p-6 backdrop-filter backdrop-blur-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-primary-light">
        Investment Tracker
      </h2>
      <form onSubmit={handleAddInvestment} className="mb-4">
        <input
          type="text"
          placeholder="Stock Symbol"
          value={newInvestment.symbol}
          onChange={e =>
            setNewInvestment({ ...newInvestment, symbol: e.target.value })
          }
          className="mr-2 p-2 border rounded bg-background-dark text-white"
          required
        />
        <input
          type="number"
          placeholder="Number of Shares"
          value={newInvestment.shares}
          onChange={e =>
            setNewInvestment({ ...newInvestment, shares: e.target.value })
          }
          className="mr-2 p-2 border rounded bg-background-dark text-white"
          required
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-primary-light text-white px-4 py-2 rounded shadow-neon"
        >
          Add Investment
        </motion.button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Investments</h3>
          <ul>
            {investments.map((investment, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-background-light hover:bg-opacity-20 p-2 rounded"
                onClick={() => setSelectedInvestment(investment)}
              >
                {investment.symbol} - {investment.shares} shares
              </li>
            ))}
          </ul>
        </div>
        {selectedInvestment && stockData && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {selectedInvestment.symbol} Details
            </h3>
            <p>Current Price: ${stockData.c}</p>
            <p>
              Change: ${stockData.d} ({stockData.dp}%)
            </p>
            <p>High: ${stockData.h}</p>
            <p>Low: ${stockData.l}</p>
            <h4 className="text-lg font-semibold mt-4 mb-2">Analysis</h4>
            <p>{analysis}</p>
            <h4 className="text-lg font-semibold mt-4 mb-2">
              Market Prediction
            </h4>
            <p>{prediction}</p>
            <h4 className="text-lg font-semibold mt-4 mb-2">Recent News</h4>
            <ul>
              {news.map((item, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light hover:underline"
                  >
                    {item.headline}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InvestmentTracker;
