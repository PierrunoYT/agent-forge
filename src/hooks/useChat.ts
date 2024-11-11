import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message, ChatSession } from '../types/Message';
import * as api from '../lib/api';
import * as storage from '../utils/storage';
import { validateMessage } from '../utils/validation';

export const useChat = (agentId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch chat history
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ['chat', agentId],
    queryFn: async () => {
      // First try to get from local storage
      const sessions = storage.getChatSessionsByAgent(agentId);
      if (sessions.length > 0) {
        const latestSession = sessions[sessions.length - 1];
        return Promise.resolve(latestSession.messages);
      }
      // If no local sessions, fetch from API
      return api.getChatHistory(agentId);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // Validate message
      const validationErrors = validateMessage(content);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Update local storage first
      const session = storage.getChatSessionsByAgent(agentId)[0] || {
        id: crypto.randomUUID(),
        agentId,
        messages: [],
        created: new Date(),
        updated: new Date(),
      };

      session.messages.push(userMessage);
      storage.saveChatSession(session);

      // Send to API and get response
      try {
        const response = await api.sendMessage(agentId, content);
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message.content,
          timestamp: new Date(),
        };

        // Update local storage with assistant response
        session.messages.push(assistantMessage);
        session.updated = new Date();
        storage.saveChatSession(session);

        return {
          userMessage,
          assistantMessage,
          usage: response.usage,
        };
      } catch (error) {
        console.error('Failed to get response from API:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', agentId] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Clear chat history
  const clearChat = () => {
    const sessions = storage.getChatSessionsByAgent(agentId);
    sessions.forEach(session => {
      storage.deleteChatSession(session.id);
    });
    queryClient.invalidateQueries({ queryKey: ['chat', agentId] });
  };

  return {
    messages,
    isLoadingMessages,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    error,
    clearChat,
  };
};
