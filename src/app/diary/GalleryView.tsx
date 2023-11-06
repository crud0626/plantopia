import Link from 'next/link';
import { DiaryContentTypes } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import NoContent from './NoContent';
import styles from './galleryView.module.scss';

interface GalleryViewProps {
  diaryData: DiaryContentTypes[] | null;
}

const GalleryView = ({ diaryData }: GalleryViewProps) => {
  const filteredDiary = diaryData?.filter(({ imgUrls }) => imgUrls.length > 0);

  const isEmpty = !filteredDiary || filteredDiary.length === 0;

  if (isEmpty) return <NoContent />;

  return (
    <div className={styles.gallery_view}>
      {filteredDiary.map(({ id, imgUrls }) => (
        <Link
          href={`${paths.diaryEdit}/${id}`}
          key={id}
          className={`${styles.card} ${
            imgUrls.length > 1 ? styles.multiple : ''
          }`}
        >
          <img src={imgUrls[0]} alt="thumbnail" />
        </Link>
      ))}
    </div>
  );
};

export default GalleryView;
