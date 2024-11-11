import React, { useState } from 'react';
import { Agent } from '../../types/Agent';
import { Button } from '../shared/Button';
import { useAgent } from '../../hooks/useAgent';

interface AgentListProps {
  onSelect: (agent: Agent) => void;
  onCreateNew: () => void;
}

export const AgentList: React.FC<AgentListProps> = ({ onSelect, onCreateNew }) => {
  const { agents, isLoadingAgents, deleteAgent } = useAgent();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (agent: Agent) => {
    try {
      setDeletingId(agent.id);
      await deleteAgent(agent.id);
    } catch (error) {
      console.error('Failed to delete agent:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoadingAgents) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Your Agents</h2>
        <Button onClick={onCreateNew}>Create New Agent</Button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No agents created yet</p>
          <div className="mt-6">
            <Button onClick={onCreateNew}>Create Your First Agent</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {agent.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {agent.model}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(agent)}
                    isLoading={deletingId === agent.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {agent.description || 'No description provided'}
              </p>
              
              <div className="mt-4 text-xs text-gray-500 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Temperature:</span>{' '}
                  {agent.temperature}
                </div>
                <div>
                  <span className="font-medium">Max Tokens:</span>{' '}
                  {agent.maxTokens}
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => onSelect(agent)}
                >
                  Chat with Agent
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
