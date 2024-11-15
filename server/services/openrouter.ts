import fetch from 'node-fetch';
import { CustomError } from '../middleware/error';
import {
  OpenRouterMessage,
  OpenRouterParameters,
  OpenRouterResponse,
  KeyInfo
} from '../../src/types/Message';

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
}

interface ProviderPreferences {
  allow_fallbacks?: boolean;
  require_parameters?: boolean;
  data_collection?: 'deny' | 'allow';
  order?: string[];
  ignore?: string[];
  quantizations?: Array<'int4' | 'int8' | 'fp6' | 'fp8' | 'fp16' | 'bf16' | 'unknown'>;
}

interface ChatRequestOptions extends OpenRouterParameters {
  model?: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
  provider?: ProviderPreferences;
  transforms?: string[];
  models?: string[];
  route?: 'fallback';
}

interface KeyResponse {
  data: KeyInfo;
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

  async chat(options: ChatRequestOptions) {
    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'Custom AI Agent',
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
          min_p: options.min_p,
          top_a: options.top_a,
          seed: options.seed,
          stop: options.stop,
          stream: options.stream ?? false,
          tools: options.tools,
          tool_choice: options.tool_choice,
          response_format: options.response_format,
          logit_bias: options.logit_bias,
          logprobs: options.logprobs,
          top_logprobs: options.top_logprobs,
          provider: options.provider,
          transforms: options.transforms,
          models: options.models,
          route: options.route,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as { error?: { message?: string; metadata?: { reasons?: string[] } } };
        if (error.error?.metadata?.reasons) {
          throw new CustomError(
            `${error.error.message} - Reasons: ${error.error.metadata.reasons.join(', ')}`,
            response.status
          );
        }
        throw new CustomError(
          error.error?.message || 'Failed to get response from OpenRouter',
          response.status
        );
      }

      const data = await response.json() as OpenRouterResponse;
      const choice = data.choices[0];

      if ('message' in choice) {
        return {
          content: choice.message.content || '',
          toolCalls: choice.message.tool_calls,
          usage: data.usage ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
            cacheDiscount: data.usage.cache_discount,
          } : undefined,
        };
      } else if ('text' in choice) {
        return {
          content: choice.text,
          usage: data.usage ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
            cacheDiscount: data.usage.cache_discount,
          } : undefined,
        };
      } else {
        throw new CustomError('Unexpected response format from OpenRouter', 500);
      }
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
          'X-Title': 'Custom AI Agent',
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

  async getKeyInfo(): Promise<KeyInfo> {
    try {
      const response = await fetch(`${this.config.baseURL}/auth/key`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'Custom AI Agent',
        },
      });

      if (!response.ok) {
        throw new CustomError('Failed to fetch key information', response.status);
      }

      const data = await response.json() as KeyResponse;
      return data.data;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to fetch key info', 500);
    }
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
