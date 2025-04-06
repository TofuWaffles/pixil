import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig(({ }) => {
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      proxy: {
        "/api": {
          target: "http://backend-dev:4000",
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("Proxy error: ", err);
            });
            proxy.on("proxyReq", (_proxyReq, req, _res) => {
              console.log("Sending request to the backend: ", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log("Received response from the backend: ", proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    preview: {
      port: 3000
    },
    define: {
      "process.env.DOMAIN_URL": JSON.stringify(process.env.VITE_DOMAIN_URL),
    },
  };
});
