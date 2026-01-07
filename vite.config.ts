import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // تمام متغیرهای محیطی را لود می‌کنیم
  const env = loadEnv(mode, process.cwd(), '');

  // اینجا چک می‌کنیم کلید با کدام اسم در Vercel ذخیره شده
  // اولویت با VITE_GEMINI_API_KEY است، اگر نبود GEMINI_API_KEY را برمی‌دارد
  const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;

  console.log("Building with API Key present:", !!apiKey); // این فقط در لاگ بیلد ورسل دیده می‌شود

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // حالا این کلید را به تمام اسم‌های احتمالی که برنامه ممکن است صدا بزند، تزریق می‌کنیم
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.API_KEY': JSON.stringify(apiKey),
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
