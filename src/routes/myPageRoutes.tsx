import { lazy } from 'react';
import paths from '@/constants/routePath';

const MyPage = lazy(() => import('@/pages/myPage/MyPage'));
const MyInfoPage = lazy(() => import('@/pages/myPage/myInfoPage/MyInfoPage'));
const GuidePage = lazy(() => import('@/pages/myPage/guidePage/GuidePage'));
const QuestionPage = lazy(
  () => import('@/pages/myPage/questionPage/QuestionPage'),
);

const myPageRoutes = [
  { path: paths.mypage, element: <MyPage /> },
  { path: paths.mypageInfo, element: <MyInfoPage /> },
  { path: paths.mypageGuide, element: <GuidePage /> },
  { path: paths.mypageQuestion, element: <QuestionPage /> },
];

export default myPageRoutes;
