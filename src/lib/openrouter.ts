interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}

interface OpenRouterResponse {
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

class OpenRouterClient {
  private config: OpenRouterConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    };
  }

  async chat(messages: { role: string; content: string }[], model: string, temperature: number = 0.7) {
    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get response from OpenRouter');
      }

      const data: OpenRouterResponse = await response.json();
      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
      };
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available models');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
let openRouterClient: OpenRouterClient | null = null;

export const initializeOpenRouter = (apiKey: string) => {
  openRouterClient = new OpenRouterClient(apiKey);
  return openRouterClient;
};

export const getOpenRouterClient = () => {
  if (!openRouterClient) {
    throw new Error('OpenRouter client not initialized. Call initializeOpenRouter first.');
  }
  return openRouterClient;
};
