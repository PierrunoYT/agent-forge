export type Role = 'system' | 'user' | 'assistant' | 'tool';

export type ContentPart = 
  | { type: 'text'; text: string }
  | { 
      type: 'image_url'; 
      image_url: {
        url: string;
        detail?: string;
      }
    };

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Message {
  id: string;
  role: Role;
  // Keep content as string for display purposes
  content: string;
  // Add richContent for multimodal messages
  richContent?: ContentPart[];
  timestamp: Date;
  name?: string;
  tool_call_id?: string;
  toolCalls?: ToolCall[];
}

export interface ChatSession {
  id: string;
  agentId: string;
  messages: Message[];
  created: Date;
  updated: Date;
}

export interface ChatResponse {
  message: Message;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Helper type for OpenRouter API messages
export interface OpenRouterMessage {
  role: Role;
  content: string | ContentPart[];
  name?: string;
  tool_call_id?: string;
}

// OpenRouter API Response Types
export interface OpenRouterResponse {
  id: string;
  choices: (NonStreamingChoice | StreamingChoice | NonChatChoice)[];
  created: number;
  model: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  system_fingerprint?: string;
  usage?: OpenRouterUsage;
}

export interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface NonChatChoice {
  finish_reason: string | null;
  text: string;
  error?: OpenRouterError;
}

export interface NonStreamingChoice {
  finish_reason: string | null;
  message: {
    content: string | null;
    role: string;
    tool_calls?: ToolCall[];
    function_call?: FunctionCall;
  };
  error?: OpenRouterError;
}

export interface StreamingChoice {
  finish_reason: string | null;
  delta: {
    content: string | null;
    role?: string;
    tool_calls?: ToolCall[];
    function_call?: FunctionCall;
  };
  error?: OpenRouterError;
}

export interface OpenRouterError {
  code: number;
  message: string;
}

export interface FunctionCall {
  name: string;
  arguments: string;
}

// Tool Types
export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface Tool {
  type: 'function';
  function: FunctionDefinition;
}

// OpenRouter API Parameters
export interface OpenRouterParameters {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  min_p?: number;
  top_a?: number;
  seed?: number;
  max_tokens?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  response_format?: {
    type: 'json_object';
  };
  stop?: string[];
  tools?: Tool[];
  tool_choice?: 'none' | 'auto' | 'required' | {
    type: 'function';
    function: {
      name: string;
    };
  };
}
