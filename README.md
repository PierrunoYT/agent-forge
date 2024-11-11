# Custom AI Agent Builder

A web application for building and testing custom AI agents using OpenRouter's API. Create, configure, and chat with AI agents powered by various language models.

## Features

- Create custom AI agents with specific behaviors and configurations
- Choose from multiple AI models through OpenRouter
- Configure model parameters (temperature, max tokens)
- Real-time chat interface for testing agents
- Local storage for agent configurations
- Express.js backend for API handling

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenRouter API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd custom-ai-agent
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
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_API_URL=http://localhost:3001/api

PORT=3001
OPENROUTER_API_KEY=your_openrouter_api_key_here
APP_URL=http://localhost:3000
NODE_ENV=development
```

## Development

Run the development server (both frontend and backend):
```bash
npm run dev
```

This will start:
- Frontend development server at http://localhost:3000
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
│   ├── agent/           # Agent-related components
│   ├── models/          # Model selection and configuration
│   └── shared/          # Shared UI components
├── lib/                 # API and SDK setup
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── utils/              # Utility functions

server/
├── routes/             # API routes
├── middleware/         # Express middleware
└── services/          # Backend services
```

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - TailwindCSS
  - React Query
  - Vite

- Backend:
  - Express.js
  - OpenRouter SDK

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenRouter for providing the AI model API
- All contributors and maintainers
