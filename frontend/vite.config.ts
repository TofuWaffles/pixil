import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig(({ }) => {
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000
    },
    preview: {
      port: 3000
    },
    define: {
      "process.env.DOMAIN_URL": JSON.stringify(process.env.VITE_DOMAIN_URL),
      "process.env.BACKEND_URL": JSON.stringify(process.env.VITE_BACKEND_URL),
    },
  };
});
