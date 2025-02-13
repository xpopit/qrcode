import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs-extra'

// ฟังก์ชันสำหรับคัดลอกไฟล์
const copyAssetsPlugin = () => ({
  name: 'copy-assets',
  writeBundle() {
    // คัดลอก libs
    if (fs.existsSync(resolve(__dirname, 'public/libs'))) {
      fs.copySync(
        resolve(__dirname, 'public/libs'),
        resolve(__dirname, 'dist/libs'),
        { overwrite: true }
      )
    }

    // คัดลอก models
    if (fs.existsSync(resolve(__dirname, 'public/models'))) {
      fs.copySync(
        resolve(__dirname, 'public/models'),
        resolve(__dirname, 'dist/models'),
        { overwrite: true }
      )
    }
  }
})

// // เพิ่ม plugin ใหม่สำหรับแทนที่ path
// const replacePathPlugin = () => ({
//   name: 'replace-path',
//   transformIndexHtml(html) {
//     return html.replace(/\/libs\//g, '/qrcode/libs/')
//   }
// })

export default defineConfig({
  plugins: [
    react(),
    copyAssetsPlugin(),
    // replacePathPlugin()
  ],
  base: '/qrcode/',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    fs: {
      allow: ['..']
    },
    host: true,
    allowedHosts: [
      '0.0.0.0',
      '6eb2-49-228-176-84.ngrok-free.app',
      '192.168.0.0/16',
      '172.16.0.0/12',
      '10.0.0.0/8'
    ]
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // เพิ่ม timestamp ใน filename เพื่อป้องกัน cache
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    }
  }
}) 