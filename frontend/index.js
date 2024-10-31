require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Routes
app.get('/api/ai/insights', async (req, res) => {
  try {
    // You might fetch user data from your database here

    // Generate insights using OpenAI
    const prompt = `Provide three personalized financial insights for a user based on their spending habits:
    1.
    2.
    3.`;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 250,
      temperature: 0.7,
    });

    const insightsText = response.data.choices[0].text.trim();
    const insightsArray = insightsText
      .split('\n')
      .filter(line => line.trim() !== '');

    const insights = insightsArray.map((item, index) => {
      return {
        id: (index + 1).toString(),
        title: `Insight ${index + 1}`,
        description: item.replace(/^\d+\.\s*/, ''),
        type: 'info', // You can enhance this based on content
      };
    });

    res.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate financial insights.' });
  }
});

app.post('/api/ai/advice', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'No query provided.' });
    }

    // Generate advice using OpenAI
    const prompt = `As a financial expert, kindly provide detailed advice for the following question:\n\n${query}\n\nAdvice:`;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const advice = response.data.choices[0].text.trim();

    res.json({ advice });
  } catch (error) {
    console.error('Error generating advice:', error);
    res.status(500).json({ error: 'Failed to generate financial advice.' });
  }
});

const budgetRouter = require('./routes/budget');
app.use('/api/budget', budgetRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
