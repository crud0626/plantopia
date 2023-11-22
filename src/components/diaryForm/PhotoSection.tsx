import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { deleteImg, uploadImg } from '@/api/storage';
import { InitialDiaryContent } from '@/@types/diary.type';
import { showAlert } from '@/utils/dialog';

import styles from './photoSection.module.scss';
import 'swiper/css';

interface SectionPhotoProps {
  imgUrls: string[];
  handleContents: (
    key: keyof InitialDiaryContent,
    value: InitialDiaryContent[typeof key],
  ) => void;
}

const imgLimit = 4;

const PhotoSection = ({ imgUrls, handleContents }: SectionPhotoProps) => {
  const handleAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];

    try {
      const url = await uploadImg(file, 'diary');
      const updatedImgs = [...imgUrls, url];

      handleContents('imgUrls', updatedImgs);
    } catch {
      showAlert('error', '이미지 업로드 도중 에러가 발생했습니다!');
    } finally {
      event.target.value = '';
    }
  };

  const handleDelete = async (targetSrc: string) => {
    try {
      await deleteImg(targetSrc);

      const updatedImgs = imgUrls.filter(url => url !== targetSrc);

      handleContents('imgUrls', updatedImgs);
    } catch (error) {
      showAlert('error', '이미지 삭제 도중 에러가 발생했습니다!');
    }
  };

  const imgCount = imgUrls.length;

  return (
    <section className={`${styles.container} inner`}>
      {imgCount < imgLimit && (
        <div className={styles.upload_button_wrapper}>
          <button type="button" className={styles.upload_button}>
            <label htmlFor="photoInput" className={styles.photo_label}>
              <div className={styles.photo_counter}>
                <span className={styles.current_count}>{imgCount}</span>
                <span>/</span>
                <span className={styles.max_count}>4</span>
              </div>
            </label>
            <input
              className={styles.photo_input}
              id="photoInput"
              accept="image/*"
              type="file"
              onChange={handleAdd}
            />
          </button>
        </div>
      )}
      <Swiper
        className={`${styles.photo_select_swiper} ${
          imgCount === imgLimit ? 'full_photo' : ''
        }`}
        modules={[Navigation]}
        slidesPerView={2.5}
      >
        {imgUrls.map((url, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.photo_slide}>
              <img src={url} alt="diary photo" />
              {index === 0 && <div className={styles.main_photo}>대표사진</div>}
            </div>
            <button
              className={styles.photo_delete_btn}
              onClick={() => handleDelete(url)}
            ></button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PhotoSection;
