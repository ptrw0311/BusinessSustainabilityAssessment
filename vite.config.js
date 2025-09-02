import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/BusinessSustainabilityAssessment/', // 改成你的 GitHub Repo 名稱
})