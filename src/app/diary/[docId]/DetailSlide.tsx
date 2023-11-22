'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { DiaryContentTypes } from '@/@types/diary.type';
import styles from './page.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DetailSlide = ({ imgUrls }: Pick<DiaryContentTypes, 'imgUrls'>) => {
  return (
    <section className={styles.slide_section}>
      <Swiper
        className={`${styles.diary_img_swiper} ${styles.swiper}`}
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        pagination={{
          clickable: true,
        }}
        onInit={swiper => {
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {imgUrls.map((imgUrl, index) => (
          <SwiperSlide key={index}>
            <div className={styles.slide_container}>
              <img
                src={imgUrl}
                className={styles.slide_img}
                alt="슬라이드 이미지"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DetailSlide;
