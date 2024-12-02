import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  server: {
      port: 80,
      host: "0.0.0.0",
      },
    plugins: [
      react(), 
      viteTsconfigPaths(),
    ],
  });
