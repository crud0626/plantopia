import { lazy } from 'react';
import paths from '@/constants/routePath';

const MyPlantMainPage = lazy(
  () => import('@/pages/myPlantPage/myPlantMainPage/MyPlantMainPage'),
);
const MyPlantDetailPage = lazy(
  () => import('@/pages/myPlantPage/myPlantDetailPage/MyPlantDetailPage'),
);
const MyPlantRegisterPage = lazy(
  () => import('@/pages/myPlantPage/myPlantRegisterPage/MyPlantRegisterPage'),
);
const MyPlantEditPage = lazy(
  () => import('@/pages/myPlantPage/myPlantEditPage/MyPlantEditPage'),
);

const myPlantRoutes = [
  { path: paths.myplant, element: <MyPlantMainPage /> },
  { path: `${paths.myplant}/:docId`, element: <MyPlantDetailPage /> },
  { path: `${paths.myplantEdit}/:docId`, element: <MyPlantEditPage /> },
  { path: paths.myplantRegister, element: <MyPlantRegisterPage /> },
];

export default myPlantRoutes;
