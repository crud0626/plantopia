import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { DiaryContentTypes } from '@/@types/diary.type';

const DetailSlide = ({ imgUrls }: Pick<DiaryContentTypes, 'imgUrls'>) => {
  return (
    <section className="slide_section">
      <Swiper
        className="diary_img_swiper swiper "
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
            <div className="slide_container">
              <img src={imgUrl} className="slide_img" alt="슬라이드 이미지" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DetailSlide;
