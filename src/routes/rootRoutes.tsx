import { lazy } from 'react';
import paths from '@/constants/routePath';

const MainPage = lazy(() => import('@/pages/mainPage/MainPage'));
const LoginPage = lazy(() => import('@/pages/loginPage/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/registerPage/RegisterPage'));
const CalendarPage = lazy(() => import('@/pages/calendarPage/CalendarPage'));
const NotFoundPage = lazy(() => import('@/pages/notFoundPage/NotFoundPage'));

const rootRoutes = [
  { path: paths.main, element: <MainPage /> },
  { path: paths.calendar, element: <CalendarPage /> },
  { path: paths.login, element: <LoginPage /> },
  { path: paths.register, element: <RegisterPage /> },
  { path: paths.notFound, element: <NotFoundPage /> },
];

export default rootRoutes;
