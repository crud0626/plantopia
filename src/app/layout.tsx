import type { Metadata } from 'next';
import Toast from '@/components/toast/Toast';
import './global.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const metadata: Metadata = {
  title: 'Plantopia',
  description: '플랜토피아와 함께 슬기로운 식집사 생활을 시작하세요!',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/logo192.png' }],
  },
  openGraph: {
    title: '플랜토피아',
    description: '플랜토피아와 함께 슬기로운 식집사 생활을 시작하세요!',
    url: 'https://plant-utopia-refactor.vercel.app/',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og_img.png' }],
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#008000" />
      </head>
      <body>
        <div id="root">
          <Toast />
          {children}
        </div>
      </body>
    </html>
  );
}
