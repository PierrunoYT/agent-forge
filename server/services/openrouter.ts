import fetch from 'node-fetch';
import { CustomError } from '../middleware/error';

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterService {
  private config: OpenRouterConfig;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is not set');
    }

    this.config = {
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    };
  }

  async chat(messages: ChatMessage[], model: string, temperature: number = 0.7) {
    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as { message?: string };
        throw new CustomError(
          error.message || 'Failed to get response from OpenRouter',
          response.status
        );
      }

      const data = await response.json() as ChatResponse;
      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('OpenRouter service error', 500);
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        },
      });

      if (!response.ok) {
        throw new CustomError('Failed to fetch available models', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to fetch models', 500);
    }
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
