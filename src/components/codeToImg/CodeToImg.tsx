import { Children } from 'react';
import styles from './codeToImg.module.scss';

const CodeToImg = (icons: string[]) => {
  return (
    <>
      {Children.toArray(
        icons.map(icon => <img src={icon} className={styles.img} alt="icon" />),
      )}
    </>
  );
};

export { CodeToImg };
