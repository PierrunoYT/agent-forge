import { Agent, AgentConfig } from '../types/Agent';
import { ChatSession } from '../types/Message';

const AGENTS_KEY = 'custom-agents';
const SESSIONS_KEY = 'chat-sessions';

// Agent Storage
export const saveAgent = (agent: AgentConfig): Agent => {
  const agents = getAgents();
  const newAgent: Agent = {
    ...agent,
    id: crypto.randomUUID(),
    created: new Date(),
    updated: new Date(),
  };
  
  agents.push(newAgent);
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
  return newAgent;
};

export const getAgents = (): Agent[] => {
  const agents = localStorage.getItem(AGENTS_KEY);
  return agents ? JSON.parse(agents) : [];
};

export const getAgent = (id: string): Agent | undefined => {
  const agents = getAgents();
  return agents.find(agent => agent.id === id);
};

export const updateAgent = (id: string, updates: Partial<AgentConfig>): Agent | null => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === id);
  
  if (index === -1) return null;
  
  const updatedAgent: Agent = {
    ...agents[index],
    ...updates,
    updated: new Date(),
  };
  
  agents[index] = updatedAgent;
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
  return updatedAgent;
};

export const deleteAgent = (id: string): boolean => {
  const agents = getAgents();
  const filteredAgents = agents.filter(agent => agent.id !== id);
  
  if (filteredAgents.length === agents.length) return false;
  
  localStorage.setItem(AGENTS_KEY, JSON.stringify(filteredAgents));
  return true;
};

// Chat Session Storage
export const saveChatSession = (session: ChatSession): void => {
  const sessions = getChatSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getChatSessions = (): ChatSession[] => {
  const sessions = localStorage.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const getChatSessionsByAgent = (agentId: string): ChatSession[] => {
  const sessions = getChatSessions();
  return sessions.filter(session => session.agentId === agentId);
};

export const updateChatSession = (sessionId: string, updates: Partial<ChatSession>): ChatSession | null => {
  const sessions = getChatSessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index === -1) return null;
  
  const updatedSession = {
    ...sessions[index],
    ...updates,
    updated: new Date(),
  };
  
  sessions[index] = updatedSession;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  return updatedSession;
};

export const deleteChatSession = (sessionId: string): boolean => {
  const sessions = getChatSessions();
  const filteredSessions = sessions.filter(session => session.id !== sessionId);
  
  if (filteredSessions.length === sessions.length) return false;
  
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(filteredSessions));
  return true;
};
