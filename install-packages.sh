#!/bin/bash

# Script to install essential Node.js packages using pnpm
echo "🚀 Starting package installation with pnpm..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in the current directory."
    echo "   Please run this script in your project root directory."
    exit 1
fi

# Define the packages you want to install
# Add or remove packages from this list as needed
PACKAGES=(
  "next-auth"
  "bcryptjs"
  "lucide-react"  # Note: Fixed from 'lucid-chart', which is likely a mistake
  "bcryptjs"
  
)

# Install each package
for pkg in "${PACKAGES[@]}"; do
    echo "📦 Installing $pkg..."
    pnpm add $pkg
done

echo "✅ All packages installed successfully!"
echo "📋 Installed packages:"
for pkg in "${PACKAGES[@]}"; do
    echo "   - $pkg"
done