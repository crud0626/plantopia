import { toast, Slide, ToastOptions } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

type NotificationTypes = Extract<
  'success' | 'error' | 'info',
  keyof typeof toast
>;

const commonToastOptions: ToastOptions = {
  transition: Slide,
  position: 'top-center',
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

const showAlert = (type: NotificationTypes, content: string) => {
  const notiFn = toast[type];
  notiFn(content, commonToastOptions);
};

/**
 * 함수 사용시 CSS에 'react-confirm-alert/src/react-confirm-alert.css'를 import 해주어야 한다.
 * @param text - 1줄의 텍스트 또는 제목과 내용
 * @param onConfirm - 확인 버튼 클릭시 호출 될 함수
 * @param onCancel - 취소 버튼 클릭시 호출 될 함수 (optional)
 */
const showConfirm = (
  text: string | [string, string],
  onConfirm: () => void,
  onCancel?: () => void,
) => {
  const hasSubText = Array.isArray(text);
  const title = hasSubText ? text[0] : text;
  const subText = hasSubText ? text[1] : undefined;

  confirmAlert({
    title,
    message: subText,
    buttons: [
      {
        label: '취소',
        className: 'cancel',
        onClick: onCancel,
      },
      {
        label: '확인',
        className: 'confirm',
        onClick: onConfirm,
      },
    ],
    closeOnEscape: false,
    closeOnClickOutside: false,
    overlayClassName: 'overlay-custom-class-name',
  });
};

export { showAlert, showConfirm };
