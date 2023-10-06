import { lazy } from 'react';
import paths from '@/constants/routePath';

const DictPage = lazy(() => import('@/pages/dictPage/DictPage'));
const DictDetailPage = lazy(
  () => import('@/pages/dictPage/dictDetailPage/DictDetailPage'),
);
const DictSearchPage = lazy(
  () => import('@/pages/dictPage/dictSearchPage/DictSearchPage'),
);

const dictRoutes = [
  { path: paths.dict, element: <DictPage /> },
  { path: paths.dictDetail, element: <DictDetailPage /> },
  { path: paths.dictSearch, element: <DictSearchPage /> },
];

export default dictRoutes;
