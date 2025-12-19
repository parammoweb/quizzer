
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file from the current directory based on `mode`
  // The third parameter '' loads all env variables regardless of prefix
  // Use (process as any).cwd() to resolve TypeScript error about missing 'cwd' property on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This maps the API_KEY from your .env file to process.env.API_KEY
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || '')
      }
    },
    server: {
      port: 3000,
      open: true
    }
  };
});
