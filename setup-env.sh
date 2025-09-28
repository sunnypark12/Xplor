#!/bin/bash

echo "🔧 Setting up Xplor Environment..."

# Create frontend environment file
echo "📝 Creating frontend environment file..."
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:8000
EOF
echo "✅ Created .env.local"

# Create backend environment file
echo "📝 Creating backend environment file..."
cat > ai/.env << EOF
# OpenAI Configuration
OPENAI_API_KEY=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

# Firebase Configuration  
FIREBASE_CREDENTIALS_PATH=../config/firebase-credentials.json
FIREBASE_PROJECT_ID=xplor-8f55e

# Kaggle Configuration (Optional - for direct API access)
KAGGLE_USERNAME=sunbun
KAGGLE_KEY=b40628bc5bfdade3d699ff74bfbbec7f

# HuggingFace Configuration (Optional)
HF_TOKEN=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

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
EOF
echo "✅ Created ai/.env"

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: ./start-backend.sh (in one terminal)"
echo "2. Run: ./start-frontend.sh (in another terminal)"
echo "3. Open: http://localhost:3000"
