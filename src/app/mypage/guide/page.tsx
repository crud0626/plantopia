'use client';

import { Children, useState } from 'react';
import PageHeader from '@/components/pageHeader/PageHeader';
import Footer from '@/components/footer/Footer';
import styles from './page.module.scss';

const contents = {
  chrome: {
    title: 'Chrome',
    image: '/assets/images/pwa_chrome.png',
  },
  ios: {
    title: 'IOS',
    image: '/assets/images/pwa_ios.png',
  },
  android: {
    title: 'Android',
    image: '/assets/images/pwa_android.png',
  },
};

const NotiPage = () => {
  const [isOpenContent, setIsOpenContent] = useState<{
    [key in keyof typeof contents]: boolean;
  }>({
    chrome: false,
    ios: false,
    android: false,
  });

  const contentNames = Object.keys(contents) as Array<keyof typeof contents>;

  return (
    <>
      <PageHeader title="사용 가이드" />
      <main className={styles.container}>
        <h2 className={styles.title}>앱처럼 사용해 보세요!</h2>
        <section className={`${styles.list_box} inner`}>
          <span className={styles.list_title}>기종별 다운로드 방법</span>
          <ul className={styles.list_contents}>
            {Children.toArray(
              contentNames.map(name => {
                const { title, image } = contents[name];
                return (
                  <li>
                    <button
                      className={`${isOpenContent[name] ? styles.open : ''}`}
                      onClick={() =>
                        setIsOpenContent(prev => ({
                          ...prev,
                          [name]: !prev[name],
                        }))
                      }
                    >
                      {title}
                    </button>
                    {isOpenContent[name] && (
                      <div className={styles.content_wrapper}>
                        <img src={image} />
                      </div>
                    )}
                  </li>
                );
              }),
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NotiPage;
