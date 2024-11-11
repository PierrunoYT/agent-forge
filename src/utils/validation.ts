import { AgentConfig } from '../types/Agent';

export const validateAgentConfig = (config: Partial<AgentConfig>): string[] => {
  const errors: string[] = [];

  if (!config.name?.trim()) {
    errors.push('Name is required');
  } else if (config.name.length < 3) {
    errors.push('Name must be at least 3 characters long');
  }

  if (!config.model?.trim()) {
    errors.push('Model selection is required');
  }

  if (!config.systemPrompt?.trim()) {
    errors.push('System prompt is required');
  } else if (config.systemPrompt.length < 10) {
    errors.push('System prompt must be at least 10 characters long');
  }

  if (typeof config.temperature !== 'number') {
    errors.push('Temperature must be a number');
  } else if (config.temperature < 0 || config.temperature > 2) {
    errors.push('Temperature must be between 0 and 2');
  }

  if (typeof config.maxTokens !== 'number') {
    errors.push('Max tokens must be a number');
  } else if (config.maxTokens < 1 || config.maxTokens > 4096) {
    errors.push('Max tokens must be between 1 and 4096');
  }

  return errors;
};

export const validateMessage = (content: string): string[] => {
  const errors: string[] = [];

  if (!content?.trim()) {
    errors.push('Message content cannot be empty');
  }

  if (content.length > 4096) {
    errors.push('Message content cannot exceed 4096 characters');
  }

  return errors;
};

export const sanitizeInput = (input: string): string => {
  // Basic XSS prevention
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
