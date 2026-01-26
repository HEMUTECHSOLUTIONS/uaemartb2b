#!/bin/bash
# UAE Mart - Local Development Server
# This script starts the server without using npm

clear
echo "========================================"
echo "UAE MART - Starting Development Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/3] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies!"
        exit 1
    fi
fi

echo "[2/3] Creating data directory..."
mkdir -p data

echo "[3/3] Starting server..."
echo ""
echo "Server will start at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Start the server directly with node
node api/server.js
