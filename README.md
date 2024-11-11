# Agent Forge

A powerful web application for building, customizing, and testing AI agents using OpenRouter's API. Create sophisticated AI agents with specific behaviors, personalities, and capabilities, then interact with them through an intuitive chat interface.

## Features

- **Custom Agent Creation**
  - Design agents with specific roles, behaviors, and expertise
  - Configure detailed system prompts and instructions
  - Set personality traits and response styles
  - Define knowledge domains and specializations

- **Advanced Model Integration**
  - Access state-of-the-art AI models through OpenRouter
  - Configure model parameters (temperature, max tokens, etc.)
  - Fine-tune response characteristics
  - Compare performance across different models

- **Interactive Development Environment**
  - Real-time chat interface for agent testing
  - Live response previews
  - Message history tracking
  - Performance analysis tools

- **Robust Architecture**
  - Local storage for agent configurations
  - Express.js backend for secure API handling
  - TypeScript for type safety
  - Modular component design

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenRouter API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/PierrunoYT/agent-forge.git
cd agent-forge
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp .env.example .env
```

4. Update the `.env` file with your OpenRouter API key and other configurations:
```env
# Frontend environment variables (must be prefixed with VITE_)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_API_URL=http://localhost:3001/api

# Backend environment variables
PORT=3001
OPENROUTER_API_KEY=your_openrouter_api_key_here
APP_URL=http://localhost:5173
NODE_ENV=development
```

## Development

Run the development server (both frontend and backend):
```bash
npm run dev
```

This will start:
- Frontend development server at http://localhost:5173
- Backend API server at http://localhost:3001

## Building for Production

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
src/
├── components/           # React components
│   ├── agent/           # Agent creation and management
│   │   ├── AgentBuilder # Agent configuration interface
│   │   ├── AgentList    # Agent management dashboard
│   │   └── AgentTester  # Chat interface for testing
│   ├── models/          # Model configuration
│   │   ├── ModelSelector# AI model selection
│   │   └── ModelConfig  # Model parameter settings
│   └── shared/          # Reusable UI components
├── lib/                 # Core functionality
│   ├── api.ts          # API client setup
│   └── openrouter.ts   # OpenRouter integration
├── types/               # TypeScript definitions
│   ├── Agent.ts        # Agent configuration types
│   └── Message.ts      # Chat message types
├── hooks/               # Custom React hooks
│   ├── useAgent.ts     # Agent management logic
│   └── useChat.ts      # Chat functionality
└── utils/              # Utility functions
    ├── storage.ts      # Local storage management
    └── validation.ts   # Input validation

server/
├── routes/             # API endpoints
│   ├── agent.ts       # Agent management routes
│   └── chat.ts        # Chat interaction routes
├── middleware/         # Express middleware
│   └── error.ts       # Error handling
└── services/          # Backend services
    └── openrouter.ts  # OpenRouter API integration
```

## Technologies Used

- Frontend:
  - React 18 with TypeScript
  - TailwindCSS for styling
  - React Query for data management
  - Vite for build tooling
  - Local Storage for persistence

- Backend:
  - Express.js with TypeScript
  - OpenRouter SDK for AI model access
  - Error handling middleware
  - Environment-based configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for providing access to state-of-the-art AI models
- All contributors and maintainers who help improve Agent Forge
- The open-source community for inspiration and tools

## Support

For support, feature requests, or bug reports, please open an issue on the GitHub repository.
