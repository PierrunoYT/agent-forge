import { Router } from 'express';
import { CustomError } from '../middleware/error';
import { openRouterService } from '../services/openrouter';
import { Message } from '../../src/types/Message';

const router = Router();

// In-memory storage for chat sessions (replace with database in production)
const chatSessions: Record<string, Message[]> = {};

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
    role: 'user',
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
    const messages = [
      { role: 'system', content: agent.systemPrompt },
      ...chatSessions[agentId].map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Get response from OpenRouter
    const response = await openRouterService.chat(
      messages,
      agent.model,
      agent.temperature
    );

    // Create assistant message
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
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
