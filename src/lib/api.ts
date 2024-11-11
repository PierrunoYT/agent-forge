import axios from 'axios';
import { Agent, AgentConfig } from '../types/Agent';
import { Message, ChatResponse } from '../types/Message';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agent endpoints
export const createAgent = async (config: AgentConfig): Promise<Agent> => {
  const response = await api.post('/agents', config);
  return response.data;
};

export const getAgents = async (): Promise<Agent[]> => {
  const response = await api.get('/agents');
  return response.data;
};

export const updateAgent = async (id: string, updates: Partial<AgentConfig>): Promise<Agent> => {
  const response = await api.patch(`/agents/${id}`, updates);
  return response.data;
};

export const deleteAgent = async (id: string): Promise<void> => {
  await api.delete(`/agents/${id}`);
};

// Chat endpoints
export const sendMessage = async (
  agentId: string,
  message: string
): Promise<ChatResponse> => {
  const response = await api.post(`/chat/${agentId}`, { message });
  return response.data;
};

export const getChatHistory = async (agentId: string): Promise<Message[]> => {
  const response = await api.get(`/chat/${agentId}/history`);
  return response.data;
};

// Model endpoints
export const getAvailableModels = async () => {
  const response = await api.get('/models');
  return response.data;
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    throw new Error(message);
  }
);

export default api;
