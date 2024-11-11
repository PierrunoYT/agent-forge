import React, { useState } from 'react';
import { AgentConfig } from '../../types/Agent';
import { ModelSelector } from '../models/ModelSelector';
import { ModelConfig } from '../models/ModelConfig';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { validateAgentConfig } from '../../utils/validation';
import { useAgent } from '../../hooks/useAgent';

interface AgentBuilderProps {
  onSuccess?: () => void;
}

export const AgentBuilder: React.FC<AgentBuilderProps> = ({ onSuccess }) => {
  const { createAgent, isCreating } = useAgent();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    model: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 2048,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate config
    const validationErrors = validateAgentConfig(config);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        const [field] = error.toLowerCase().split(' ');
        errorMap[field] = error;
      });
      setErrors(errorMap);
      return;
    }

    try {
      await createAgent(config);
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create agent:', error);
      setErrors({ submit: 'Failed to create agent. Please try again.' });
    }
  };

  const handleChange = (field: keyof AgentConfig, value: string | number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Agent</h2>
        
        <div className="space-y-4">
          <Input
            label="Name"
            value={config.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="My Custom Agent"
            error={errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="What is this agent's purpose?"
            />
          </div>

          <ModelSelector
            value={config.model}
            onChange={(value) => handleChange('model', value)}
            error={errors.model}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt
            </label>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              rows={5}
              className={`
                block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.systemPrompt ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Define the agent's behavior and capabilities..."
            />
            {errors.systemPrompt && (
              <p className="mt-2 text-sm text-red-600">{errors.systemPrompt}</p>
            )}
          </div>

          <ModelConfig
            temperature={config.temperature}
            maxTokens={config.maxTokens}
            onTemperatureChange={(value) => handleChange('temperature', value)}
            onMaxTokensChange={(value) => handleChange('maxTokens', value)}
            errors={{
              temperature: errors.temperature,
              maxTokens: errors.maxTokens,
            }}
          />
        </div>

        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onSuccess?.()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating}
            disabled={isCreating}
          >
            Create Agent
          </Button>
        </div>
      </div>
    </form>
  );
};
