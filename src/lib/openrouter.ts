interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}

// Request types
type ContentPart = 
  | { type: 'text'; text: string }
  | { 
      type: 'image_url'; 
      image_url: {
        url: string;
        detail?: string;
      }
    };

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | ContentPart[];
  name?: string;
  tool_call_id?: string;
}

interface FunctionDescription {
  description?: string;
  name: string;
  parameters: object; // JSON Schema object
}

interface Tool {
  type: 'function';
  function: FunctionDescription;
}

type ToolChoice = 
  | 'none'
  | 'auto'
  | {
      type: 'function';
      function: { name: string };
    };

interface ProviderPreferences {
  allow_fallbacks?: boolean;
  require_parameters?: boolean;
  data_collection?: 'deny' | 'allow';
  order?: string[];
  ignore?: string[];
  quantizations?: Array<'int4' | 'int8' | 'fp6' | 'fp8' | 'fp16' | 'bf16' | 'unknown'>;
}

interface ChatRequestOptions {
  model?: string;
  messages: Message[];
  response_format?: { type: 'json_object' };
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  seed?: number;
  stop?: string | string[];
  stream?: boolean;
  tools?: Tool[];
  tool_choice?: ToolChoice;
  provider?: ProviderPreferences;
  transforms?: string[];
  models?: string[];
  route?: 'fallback';
}

// Response types
interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
      tool_calls?: {
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }[];
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

  async chat(options: ChatRequestOptions) {
    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Custom AI Agent', // Optional title for openrouter.ai rankings
        },
        body: JSON.stringify({
          model: options.model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens,
          top_p: options.top_p,
          top_k: options.top_k,
          frequency_penalty: options.frequency_penalty,
          presence_penalty: options.presence_penalty,
          repetition_penalty: options.repetition_penalty,
          seed: options.seed,
          stop: options.stop,
          stream: options.stream ?? false,
          tools: options.tools,
          tool_choice: options.tool_choice,
          response_format: options.response_format,
          provider: options.provider,
          transforms: options.transforms,
          models: options.models,
          route: options.route,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get response from OpenRouter');
      }

      const data: OpenRouterResponse = await response.json();
      return {
        content: data.choices[0].message.content,
        toolCalls: data.choices[0].message.tool_calls,
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
          'X-Title': 'Custom AI Agent',
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
