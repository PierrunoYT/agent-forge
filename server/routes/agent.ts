import { Router } from 'express';
import { CustomError } from '../middleware/error';
import { Agent, AgentConfig } from '../../src/types/Agent';

const router = Router();

// In-memory storage for agents (replace with database in production)
let agents: Agent[] = [];

// Get all agents
router.get('/', (req, res) => {
  res.json(agents);
});

// Create new agent
router.post('/', (req, res) => {
  const config: AgentConfig = req.body;

  // Validate required fields
  if (!config.name || !config.model || !config.systemPrompt) {
    throw new CustomError('Missing required fields', 400);
  }

  const newAgent: Agent = {
    id: crypto.randomUUID(),
    ...config,
    created: new Date(),
    updated: new Date(),
  };

  agents.push(newAgent);
  res.status(201).json(newAgent);
});

// Update agent
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const updates: Partial<AgentConfig> = req.body;

  const agentIndex = agents.findIndex(agent => agent.id === id);
  if (agentIndex === -1) {
    throw new CustomError('Agent not found', 404);
  }

  const updatedAgent: Agent = {
    ...agents[agentIndex],
    ...updates,
    updated: new Date(),
  };

  agents[agentIndex] = updatedAgent;
  res.json(updatedAgent);
});

// Delete agent
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const initialLength = agents.length;
  agents = agents.filter(agent => agent.id !== id);

  if (agents.length === initialLength) {
    throw new CustomError('Agent not found', 404);
  }

  res.status(204).send();
});

// Get single agent
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const agent = agents.find(agent => agent.id === id);
  if (!agent) {
    throw new CustomError('Agent not found', 404);
  }

  res.json(agent);
});

export const agentRouter = router;
