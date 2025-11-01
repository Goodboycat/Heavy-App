#!/bin/bash
echo "=== Fixing Client Build ==="

cd client

echo "1. Installing missing Vite dependencies..."
npm install @vitejs/plugin-react @tailwindcss/vite vite tailwindcss --save-dev --legacy-peer-deps

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
    "@capacitor/core": "^5.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^5.0.0",
    "@tailwindcss/vite": "^0.0.0",
    "@vitest/coverage-v8": "^0.34.0",
    "tailwindcss": "^3.0.0",
    "vite": "^4.0.0",
    "vitest": "^0.34.0"
  }
}
PACKAGE_EOF

echo "3. Creating Vite config..."
cat > vite.config.ts << 'VITE_EOF'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  }
})
VITE_EOF

echo "4. Installing all dependencies..."
npm install --legacy-peer-deps

echo "5. Testing build..."
if npm run build; then
  echo "✅ Build successful!"
  echo "6. Syncing with Capacitor..."
  npx cap sync android
else
  echo "❌ Build failed, checking errors..."
  exit 1
fi

echo "=== Fix Complete ==="
