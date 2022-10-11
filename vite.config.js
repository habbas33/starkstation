import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://170.187.225.159:3000/",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
