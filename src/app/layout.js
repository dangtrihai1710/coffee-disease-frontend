// File: src/app/layout.jsx - Layout chính với AuthProvider
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Coffee Disease Analysis',
  description: 'Hệ thống phân tích bệnh lá cà phê bằng AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}