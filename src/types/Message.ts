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
