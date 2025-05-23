# Codeforces Roaster

A fun web application that generates roasts for Codeforces users based on their profile and performance data.

## Features

- Fetches user data from Codeforces API
- Generates personalized roasts using Google's Gemini AI
- Clean and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Google AI API key (Gemini)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cfroaster
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
cfroaster/
├── public/           # Static files
│   ├── index.html    # Main HTML file
│   ├── style.css     # Styles
│   └── script.js     # Frontend JavaScript
├── server.js         # Express server
├── package.json      # Project dependencies
└── README.md         # This file
```

## Security Note

Never commit your `.env` file or expose your API keys in the code. The current implementation includes a placeholder API key in the code for demonstration purposes, but in a production environment, it should be properly secured using environment variables. 