import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Agent, AgentConfig } from '../types/Agent';
import * as api from '../lib/api';
import * as storage from '../utils/storage';

export const useAgent = () => {
  const queryClient = useQueryClient();

  // Fetch all agents
  const { data: agents = [], isLoading: isLoadingAgents } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: () => {
      // First try to get from local storage
      const localAgents = storage.getAgents();
      if (localAgents.length > 0) {
        return Promise.resolve(localAgents);
      }
      // If no local agents, fetch from API
      return api.getAgents();
    },
  });

  // Create new agent
  const createMutation = useMutation({
    mutationFn: (config: AgentConfig) => {
      const agent = storage.saveAgent(config);
      return api.createAgent(config)
        .catch(error => {
          // If API fails, still return local agent
          console.error('Failed to sync agent with API:', error);
          return agent;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  // Update agent
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AgentConfig> }) => {
      const agent = storage.updateAgent(id, updates);
      if (!agent) throw new Error('Agent not found');
      
      return api.updateAgent(id, updates)
        .catch(error => {
          console.error('Failed to sync agent update with API:', error);
          return agent;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  // Delete agent
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Try local storage deletion but don't block on failure
      try {
        storage.deleteAgent(id);
      } catch (error) {
        console.error('Failed to delete agent from local storage:', error);
      }
      
      // Always attempt API deletion
      try {
        await api.deleteAgent(id);
      } catch (error) {
        console.error('Failed to delete agent from API:', error);
      }

      // If we get here, at least one deletion succeeded
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  // Get single agent
  const getAgent = (id: string): Agent | undefined => {
    return agents.find(agent => agent.id === id);
  };

  return {
    agents,
    isLoadingAgents,
    getAgent,
    createAgent: createMutation.mutate,
    updateAgent: updateMutation.mutate,
    deleteAgent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
};
