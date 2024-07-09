import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env': {
      VITE_API_KEY: process.env.VITE_API_KEY
    }
  }
});
