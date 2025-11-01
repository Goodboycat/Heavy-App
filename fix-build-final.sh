#!/bin/bash
echo "=== Final Build Fix ==="

cd client

echo "1. Removing problematic dependencies..."
npm uninstall @tailwindcss/vite

echo "2. Installing correct Tailwind CSS setup..."
npm install -D tailwindcss postcss autoprefixer --legacy-peer-deps

echo "3. Initializing Tailwind CSS..."
npx tailwindcss init -p

echo "4. Updating package.json..."
cat > package.json << 'PACKAGE_EOF'
{
  "name": "client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "cap:sync": "cap sync",
    "cap:build": "npm run build && cap sync"
  },
  "dependencies": {
    "@capacitor/android": "^5.0.0",
    "@capacitor/core": "^5.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^5.0.0",
    "@vitest/coverage-v8": "^0.34.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.0.0",
    "vite": "^4.0.0",
    "vitest": "^0.34.0"
  }
}
PACKAGE_EOF

echo "5. Creating Vite config..."
cat > vite.config.ts << 'VITE_EOF'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  }
})
VITE_EOF

echo "6. Updating Tailwind config..."
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
TAILWIND_EOF

echo "7. Installing all dependencies..."
npm install --legacy-peer-deps

echo "8. Testing build..."
if npm run build; then
  echo "✅ Build successful!"
  echo "9. Syncing with Capacitor..."
  npx cap sync android
else
  echo "❌ Build failed"
  exit 1
fi

echo "=== Fix Complete ==="
