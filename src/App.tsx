import { useEffect, Suspense } from 'react';
import Progress from './components/progress/Progress';
import Toast from './components/toast/Toast';
import AppRoutes from './routes/AppRoutes';
import { setBodyHeight } from './utils/setBodyHeight';

import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '@/styles/alertStyle.scss';

const App = () => {
  useEffect(() => {
    setBodyHeight();
  }, []);

  return (
    <>
      <Toast />
      <Suspense fallback={<Progress />}>
        <AppRoutes />
      </Suspense>
    </>
  );
};

export default App;
