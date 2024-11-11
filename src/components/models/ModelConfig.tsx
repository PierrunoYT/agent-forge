import React from 'react';
import { Input } from '../shared/Input';

interface ModelConfigProps {
  temperature: number;
  maxTokens: number;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  errors?: {
    temperature?: string;
    maxTokens?: string;
  };
}

export const ModelConfig: React.FC<ModelConfigProps> = ({
  temperature,
  maxTokens,
  onTemperatureChange,
  onMaxTokensChange,
  errors = {},
}) => {
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onTemperatureChange(Math.min(2, Math.max(0, value)));
    }
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onMaxTokensChange(Math.min(4096, Math.max(1, value)));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model Parameters
        </label>
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <div>
            <Input
              type="number"
              label="Temperature"
              value={temperature}
              onChange={handleTemperatureChange}
              min={0}
              max={2}
              step={0.1}
              error={errors.temperature}
              helperText="Controls randomness: 0 is focused, 2 is more creative"
            />
            <div className="mt-2">
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={temperature}
                onChange={handleTemperatureChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused (0)</span>
                <span>Balanced (1)</span>
                <span>Creative (2)</span>
              </div>
            </div>
          </div>

          <div>
            <Input
              type="number"
              label="Max Tokens"
              value={maxTokens}
              onChange={handleMaxTokensChange}
              min={1}
              max={4096}
              error={errors.maxTokens}
              helperText="Maximum number of tokens to generate (1-4096)"
            />
            <div className="mt-2">
              <input
                type="range"
                min={1}
                max={4096}
                step={1}
                value={maxTokens}
                onChange={handleMaxTokensChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>2048</span>
                <span>4096</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
