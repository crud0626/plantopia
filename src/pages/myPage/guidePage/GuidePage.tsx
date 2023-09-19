import { Children, useState } from 'react';
import './guidePage.scss';
import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import Footer from '@/components/footer/Footer';
import CHROME_IMG from '@/assets/images/pwa_chrome.png';
import IOS_IMG from '@/assets/images/pwa_ios.png';
import ANDROID_IMG from '@/assets/images/pwa_android.png';
import BTN_DOWN from '@/assets/images/icons/button_down.png';
import BTN_UP from '@/assets/images/icons/button_up.png';

const contents = {
  chrome: {
    title: 'Chrome',
    image: CHROME_IMG,
  },
  ios: {
    title: 'IOS',
    image: IOS_IMG,
  },
  android: {
    title: 'Android',
    image: ANDROID_IMG,
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
    <div className="noti_container layout">
      <HeaderBefore title="사용 가이드" />
      <main>
        <h2 className="noti_title">앱처럼 사용해 보세요!</h2>
        <section className="list_box inner">
          <span className="list_title">기종별 다운로드 방법</span>
          <ul className="list_contents">
            {Children.toArray(
              contentNames.map(name => {
                const { title, image } = contents[name];
                return (
                  <li>
                    <button
                      onClick={() =>
                        setIsOpenContent(prev => ({
                          ...prev,
                          [name]: !prev[name],
                        }))
                      }
                    >
                      {title}
                      <img src={isOpenContent[name] ? BTN_UP : BTN_DOWN} />
                    </button>
                    {isOpenContent[name] && (
                      <div className="content_wrapper">
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
    </div>
  );
};

export default NotiPage;
