# Blind Assistant Web App

A luxurious assistive technology web application for visually impaired users featuring voice commands, real-time object detection, and navigation assistance.

## Deployment Guide for Vercel

### Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (you can sign up with your GitHub account)
- A [Clerk](https://clerk.dev) account for authentication

### Step 1: Prepare Your Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
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
```

### Step 2: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize Git in your project (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as a remote:
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
4. Push your code:
   ```
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: web_app
   - Build Command: npm run build
   - Output Directory: .next
5. Add your environment variables from Step 1
6. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your custom domain and follow the instructions

### Step 5: Set Up Continuous Deployment

Vercel automatically sets up continuous deployment. Any push to your main branch will trigger a new deployment.

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```
npm run build
```

## Starting Production Server

```
npm start
``` 