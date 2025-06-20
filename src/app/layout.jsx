// ===================================================================
// File: src/app/layout.jsx - ROOT LAYOUT VỚI AUTHPROVIDER
// ===================================================================

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Coffee Disease Analysis - Phân tích bệnh lá cà phê',
  description: 'Hệ thống AI phân tích và chẩn đoán bệnh lá cà phê',
  keywords: 'coffee, disease, analysis, AI, machine learning, phân tích bệnh cà phê',
  author: 'Coffee Disease Analysis Team',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* SEO Meta Tags */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        
        <title>{metadata.title}</title>
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* ✅ BỌC TOÀN BỘ APP TRONG AUTHPROVIDER */}
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
        
        {/* Console log for debugging */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("🚀 Coffee Disease Analysis App Loaded");
              console.log("🔧 Environment:", "${process.env.NODE_ENV}");
              console.log("🌐 API Base URL:", "${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7179'}");
            `,
          }}
        />
      </body>
    </html>
  );
}