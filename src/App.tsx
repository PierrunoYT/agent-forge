import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Agent } from './types/Agent';
import { AgentBuilder } from './components/agent/AgentBuilder';
import { AgentList } from './components/agent/AgentList';
import { AgentTester } from './components/agent/AgentTester';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [view, setView] = useState<'list' | 'create' | 'test'>('list');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setView('test');
  };

  const handleCreateNew = () => {
    setView('create');
  };

  const handleBack = () => {
    setView('list');
    setSelectedAgent(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Custom AI Agent Builder
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {view === 'list' && (
            <AgentList
              onSelect={handleSelectAgent}
              onCreateNew={handleCreateNew}
            />
          )}

          {view === 'create' && (
            <AgentBuilder
              onSuccess={() => {
                setView('list');
              }}
            />
          )}

          {view === 'test' && selectedAgent && (
            <AgentTester
              agent={selectedAgent}
              onBack={handleBack}
            />
          )}
        </main>

        <footer className="bg-white shadow mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              Powered by OpenRouter - Build and test custom AI agents with various models
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
