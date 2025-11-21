import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/myapp/',  // Set this to your deploy base path, or '/' if root
  plugins: [react()],
})
