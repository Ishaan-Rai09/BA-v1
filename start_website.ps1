#!/usr/bin/env pwsh

# Blind Assistant Website Startup Script
# This script starts both the FastAPI backend and Next.js frontend

Write-Host "🌐 Starting Blind Assistant Full Website..." -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if required ports are available
$backendPort = 8000
$frontendPort = 3000

if (Test-Port $backendPort) {
    Write-Host "⚠️  Port $backendPort is already in use. Backend might already be running." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port $backendPort is available for backend" -ForegroundColor Green
}

if (Test-Port $frontendPort) {
    Write-Host "⚠️  Port $frontendPort is already in use. Frontend might already be running." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port $frontendPort is available for frontend" -ForegroundColor Green
}

Write-Host "`n🚀 Starting services..." -ForegroundColor Magenta

# Start Backend (FastAPI)
Write-Host "📡 Starting FastAPI Backend Server..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location "D:\Projects\Dekhte hai\Blind_Assistant\python_files"
    python backend_main.py
}

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend (Next.js)
Write-Host "🌟 Starting Next.js Frontend Server..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "D:\Projects\Dekhte hai\Blind_Assistant\web_app"
    npm run dev
}

# Wait a moment for frontend to start
Start-Sleep -Seconds 5

# Display status
Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
Write-Host "🎉 BLIND ASSISTANT WEBSITE RUNNING!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "📡 Backend API: http://localhost:8000" -ForegroundColor Yellow
Write-Host "📡 API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "🌐 Frontend Web App: http://localhost:3000" -ForegroundColor Yellow
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host "`n🎯 Features Available:" -ForegroundColor Magenta
Write-Host "• Voice Command Recognition" -ForegroundColor White
Write-Host "• Real-time Object Detection" -ForegroundColor White
Write-Host "• Navigation & Location Services" -ForegroundColor White
Write-Host "• Emergency Services" -ForegroundColor White
Write-Host "• Accessibility Features" -ForegroundColor White
Write-Host "• User Authentication (Clerk)" -ForegroundColor White

Write-Host "`n⌨️  Controls:" -ForegroundColor Yellow
Write-Host "• Press Ctrl+C to stop both servers" -ForegroundColor White
Write-Host "• Press 'q' to quit gracefully" -ForegroundColor White

# Monitor jobs and wait for user input
try {
    while ($true) {
        # Check if jobs are still running
        if ($backendJob.State -eq "Failed") {
            Write-Host "❌ Backend job failed!" -ForegroundColor Red
            Receive-Job $backendJob
        }
        
        if ($frontendJob.State -eq "Failed") {
            Write-Host "❌ Frontend job failed!" -ForegroundColor Red
            Receive-Job $frontendJob
        }
        
        # Check for user input
        if ([System.Console]::KeyAvailable) {
            $key = [System.Console]::ReadKey($true)
            if ($key.KeyChar -eq 'q') {
                Write-Host "`n🛑 Shutting down servers..." -ForegroundColor Yellow
                break
            }
        }
        
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "`n🛑 Shutting down servers..." -ForegroundColor Yellow
} finally {
    # Clean up jobs
    if ($backendJob) {
        Stop-Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob -ErrorAction SilentlyContinue
    }
    
    if ($frontendJob) {
        Stop-Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $frontendJob -ErrorAction SilentlyContinue
    }
    
    Write-Host "✅ Services stopped successfully!" -ForegroundColor Green
    Write-Host "👋 Thank you for using Blind Assistant!" -ForegroundColor Cyan
}
