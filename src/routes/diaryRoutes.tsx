import { lazy } from 'react';

const DiaryMainPage = lazy(
  () => import('@/pages/diaryPage/diaryMainPage/DiaryMainPage'),
);
const DiaryDetailPage = lazy(
  () => import('@/pages/diaryPage/diaryDetailPage/DiaryDetailPage'),
);
const DiaryWritePage = lazy(
  () => import('@/pages/diaryPage/diaryWritePage/DiaryWritePage'),
);
const DiaryEditPage = lazy(
  () => import('@/pages/diaryPage/diaryEditPage/DiaryEditPage'),
);

const diaryRoutes = [
  { path: '/diary', element: <DiaryMainPage /> },
  {
    path: '/diary/:docId',
    element: <DiaryDetailPage />,
  },
  { path: '/diary/write', element: <DiaryWritePage /> },
  { path: '/diary/edit/:docId', element: <DiaryEditPage /> },
];

export default diaryRoutes;
