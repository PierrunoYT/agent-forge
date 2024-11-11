import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOpenRouterClient } from '../../lib/openrouter';

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  error?: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const { data: models = [], isLoading } = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: async () => {
      try {
        const client = getOpenRouterClient();
        const response = await client.getAvailableModels();
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch models:', error);
        return [];
      }
    },
  });

  return (
    <div>
      <label
        htmlFor="model-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Model
      </label>
      <div className="relative">
        <select
          id="model-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${error ? 'border-red-300 text-red-900' : ''}
            ${isLoading ? 'opacity-50' : ''}
          `}
          disabled={isLoading}
        >
          <option value="">Select a model</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} - {model.context_length} tokens
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {value && !isLoading && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {models.find((m) => m.id === value)?.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Pricing: {models.find((m) => m.id === value)?.pricing.prompt} per prompt token,{' '}
            {models.find((m) => m.id === value)?.pricing.completion} per completion token
          </p>
        </div>
      )}
    </div>
  );
};
