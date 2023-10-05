import { lazy } from 'react';
import paths from '@/constants/routePath';

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
  { path: paths.diary, element: <DiaryMainPage /> },
  {
    path: `${paths.diary}/:docId`,
    element: <DiaryDetailPage />,
  },
  { path: paths.diaryWrite, element: <DiaryWritePage /> },
  { path: `${paths.diaryEdit}/:docId`, element: <DiaryEditPage /> },
];

export default diaryRoutes;
