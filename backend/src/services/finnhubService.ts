import finnhub from 'finnhub';

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

export const getStockQuote = (symbol: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    finnhubClient.quote(symbol, (error: any, data: any, response: any) => {
      if (error) {
        console.error('Error fetching stock quote:', error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const getCompanyNews = (
  symbol: string,
  from: string,
  to: string,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    finnhubClient.companyNews(
      symbol,
      from,
      to,
      (error: any, data: any, response: any) => {
        if (error) {
          console.error('Error fetching company news:', error);
          reject(error);
        } else {
          resolve(data);
        }
      },
    );
  });
};
