import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '	#008000',
};

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
    statusBarStyle: 'green',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
