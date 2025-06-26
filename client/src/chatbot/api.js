import axios from 'axios';
import { API_KEY } from '@env'

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

export const sendMessageToBot = async (message) => {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        model: 'gpt-3.5-turbo', 
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const output = response.data?.choices?.[0]?.message?.content;

    if (!output) throw new Error('No response from ChatGPT');

    return output;
  } catch (error) {
    console.error('ChatGPT API error:', error.response?.data || error.message);
    throw error;
  }
};
