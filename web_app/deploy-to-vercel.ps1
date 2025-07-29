# PowerShell script to help deploy to Vercel

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    # Do nothing
}

if ($null -eq $vercelInstalled) {
    Write-Host "Vercel CLI is not installed. Installing it now..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "Creating .env.local file. Please fill in your environment variables." -ForegroundColor Yellow
    
    @"
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
"@ | Out-File -FilePath .env.local -Encoding utf8
    
    Write-Host "Please edit the .env.local file with your actual values before continuing." -ForegroundColor Yellow
    Write-Host "Press any key to continue after editing..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Ask if user wants to deploy
$deployNow = Read-Host "Do you want to deploy to Vercel now? (y/n)"
if ($deployNow -eq "y") {
    Write-Host "Deploying to Vercel..." -ForegroundColor Green
    vercel
} else {
    Write-Host "To deploy manually, run 'vercel' in this directory." -ForegroundColor Cyan
}

Write-Host "Deployment script completed!" -ForegroundColor Green 