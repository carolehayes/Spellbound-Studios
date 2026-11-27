import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_LAUNCHPAD_REVIEW': JSON.stringify(process.env.VERCEL_ENV === 'preview' || process.env.LAUNCHPAD_REVIEW === '1'),
  },
});
