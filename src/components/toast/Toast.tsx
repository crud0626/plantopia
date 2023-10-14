import { ToastContainer, Slide } from 'react-toastify';
import './toast.scss';

export const Toast = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      transition={Slide}
      hideProgressBar
    />
  );
};

export default Toast;
