import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    watch: {
      ignored: [
        '**/legacy/**',
        '**/dist/**',
        '**/.firebase/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/mnt/**',
        '**/supabase/**',
        '**/*.log',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      '@supabase/supabase-js',
      '@google/generative-ai',
      'recharts',
      'lucide-react',
    ],
  },
})
