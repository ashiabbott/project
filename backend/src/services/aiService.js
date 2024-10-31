import axios from 'axios';

/**
 * @desc    Generate AI response to the user's message
 * @param   {String} message - User's message
 * @param   {Object} user - User object
 * @returns {Promise<String>} - AI assistant's response
 */
export const generateAIResponse = async (message, user) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content.trim();

    return aiMessage;
  } catch (error) {
    console.error('Error generating AI response:', error.message);
    throw new Error('Failed to generate AI response');
  }
};
