import { lazy } from 'react';

const DiaryMainPage = lazy(
  () => import('@/pages/diaryPage/diaryMainPage/DiaryMainPage'),
);
const DiaryWritePage = lazy(
  () => import('@/pages/diaryPage/diaryWritePage/DiaryWritePage'),
);
const DiaryEditPage = lazy(
  () => import('@/pages/diaryPage/diaryEditPage/DiaryEditPage'),
);
const DiaryDetailPage = lazy(
  () => import('@/pages/diaryPage/diaryDetailPage/DiaryDetailPage'),
);

const diaryRoutes = [
  { path: '/diary', element: <DiaryMainPage /> },
  { path: '/diary/write', element: <DiaryWritePage /> },
  { path: '/diary/:docId/edit', element: <DiaryEditPage /> },
  {
    path: '/diary/:docId',
    element: <DiaryDetailPage />,
  },
];

export default diaryRoutes;
