#!/bin/bash

echo "🌐 Starting Xplor Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating environment configuration..."
    echo "REACT_APP_API_URL=http://localhost:8000" > .env.local
fi

# Start the development server
echo "🚀 Starting React development server..."
npm start
