import { Router } from 'express';
import { CustomError } from '../middleware/error';
import { openRouterService } from '../services/openrouter';
import { Message, OpenRouterMessage, Role } from '../../src/types/Message';

const router = Router();

// In-memory storage for chat sessions (replace with database in production)
const chatSessions: Record<string, Message[]> = {};

// Helper function to convert our Message to OpenRouter message format
const toOpenRouterMessage = (message: Message): OpenRouterMessage => ({
  role: message.role,
  content: message.richContent || message.content,
  name: message.name,
  tool_call_id: message.tool_call_id,
});

// Get chat history for an agent
router.get('/:agentId/history', (req, res) => {
  const { agentId } = req.params;
  res.json(chatSessions[agentId] || []);
});

// Send message to agent
router.post('/:agentId', async (req, res) => {
  const { agentId } = req.params;
  const { message } = req.body;

  if (!message?.trim()) {
    throw new CustomError('Message content is required', 400);
  }

  // Initialize chat session if it doesn't exist
  if (!chatSessions[agentId]) {
    chatSessions[agentId] = [];
  }

  // Create user message
  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: 'user' as Role,
    content: message,
    timestamp: new Date(),
  };

  // Add user message to session
  chatSessions[agentId].push(userMessage);

  try {
    // Get agent configuration (in production, fetch from database)
    const agent = {
      model: 'anthropic/claude-2', // Default model, should be fetched from agent config
      systemPrompt: 'You are a helpful AI assistant.', // Should be fetched from agent config
      temperature: 0.7, // Should be fetched from agent config
    };

    // Prepare messages for OpenRouter
    const messages: OpenRouterMessage[] = [
      { role: 'system' as Role, content: agent.systemPrompt },
      ...chatSessions[agentId].map(toOpenRouterMessage),
    ];

    // Get response from OpenRouter
    const response = await openRouterService.chat({
      messages,
      model: agent.model,
      temperature: agent.temperature,
      provider: {
        allow_fallbacks: true, // Enable fallbacks by default
      }
    });

    // Create assistant message
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant' as Role,
      content: response.content,
      timestamp: new Date(),
      toolCalls: response.toolCalls,
    };

    // Add assistant message to session
    chatSessions[agentId].push(assistantMessage);

    // Return both messages and usage information
    res.json({
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error) {
    // Remove user message if request fails
    chatSessions[agentId] = chatSessions[agentId].filter(
      msg => msg.id !== userMessage.id
    );
    throw error;
  }
});

// Clear chat history
router.delete('/:agentId/history', (req, res) => {
  const { agentId } = req.params;
  delete chatSessions[agentId];
  res.status(204).send();
});

export const chatRouter = router;
