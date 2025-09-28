#!/bin/bash

echo "🚀 Starting Xplor AI Backend Server..."

# Navigate to AI directory
cd ai

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create one based on env_example.txt"
    echo "📋 Copying env_example.txt to .env..."
    cp env_example.txt .env
    echo "✏️  Please edit .env file with your API keys before continuing."
    echo "Press any key to continue once you've updated the .env file..."
    read -n 1 -s
fi

# Start the server
echo "🌟 Starting AI Travel Agent API server..."
python run_server.py
