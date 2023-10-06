import { Link } from 'react-router-dom';
import { DiaryContentTypes } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import NoContent from './NoContent';
import './galleryView.scss';

interface GalleryViewProps {
  diaryData: DiaryContentTypes[] | null;
}

const GalleryView = ({ diaryData }: GalleryViewProps) => {
  const filteredDiary = diaryData?.filter(({ imgUrls }) => imgUrls.length > 0);

  const isEmpty = !filteredDiary || filteredDiary.length === 0;

  if (isEmpty) return <NoContent />;

  return (
    <div className="gallery_view">
      {filteredDiary.map(({ id, imgUrls }) => (
        <Link
          to={`${paths.diaryEdit}/${id}`}
          key={id}
          className={`card ${imgUrls.length > 1 ? 'multiple' : ''}`}
        >
          <img src={imgUrls[0]} alt="thumbnail" />
        </Link>
      ))}
    </div>
  );
};

export default GalleryView;
