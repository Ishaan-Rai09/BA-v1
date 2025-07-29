#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing it now..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file. Please fill in your environment variables."
    
    cat > .env.local << EOL
# Clerk Authentication (Get these from your Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Backend URLs
NEXT_PUBLIC_API_URL=https://your-backend-url.com
EOL
    
    echo "Please edit the .env.local file with your actual values before continuing."
    echo "Press Enter to continue after editing..."
    read
fi

# Ask if user wants to deploy
read -p "Do you want to deploy to Vercel now? (y/n) " deploy_now
if [ "$deploy_now" = "y" ]; then
    echo "Deploying to Vercel..."
    vercel
else
    echo "To deploy manually, run 'vercel' in this directory."
fi

echo "Deployment script completed!" 