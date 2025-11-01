#!/bin/bash
echo "=== Fixing React Build ==="

cd client

echo "1. Installing React dependencies..."
npm install react react-dom --save --legacy-peer-deps
npm install @types/react @types/react-dom @vitejs/plugin-react --save-dev --legacy-peer-deps

echo "2. Updating package.json..."
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
    "@capacitor/core": "^5.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@vitest/coverage-v8": "^0.34.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.0.0",
    "vite": "^4.0.0",
    "vitest": "^0.34.0"
  }
}
PACKAGE_EOF

echo "3. Creating React Vite config..."
cat > vite.config.ts << 'VITE_EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  }
})
VITE_EOF

echo "4. Updating Tailwind config for React..."
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

echo "5. Installing all dependencies..."
npm install --legacy-peer-deps

echo "6. Testing build..."
if npm run build; then
  echo "✅ Build successful!"
  echo "7. Syncing with Capacitor..."
  npx cap sync android
else
  echo "❌ Build failed"
  exit 1
fi

echo "=== Fix Complete ==="
