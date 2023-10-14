import { useEffect } from 'react';

export const useOutsideClick = (
  callbackFn: (event: MouseEvent) => void,
): void => {
  useEffect(() => {
    document.body.addEventListener('click', callbackFn);

    return () => document.body.removeEventListener('click', callbackFn);
  }, []);
};
