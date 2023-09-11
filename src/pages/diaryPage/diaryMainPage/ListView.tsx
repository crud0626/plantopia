import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DiaryContentTypes } from '@/@types/diary.type';
import { showAlert } from '@/utils/alarmUtil';

import NoContent from './NoContent';
import './listView.scss';

interface ListViewProps {
  diaryData: DiaryContentTypes[] | null;
  handleDelete: (diaryId: string) => void;
}

const ListView = ({ diaryData, handleDelete }: ListViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<DiaryContentTypes | null>(
    null,
  );

  const toggleModal = (diary: DiaryContentTypes) => {
    setSelectedDiary(diary);
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setSelectedDiary(null);
    setIsModalOpen(false);
  };

  const navigateToEdit = (diary: DiaryContentTypes) => {
    navigate(`/diary/${diary.id}/edit`);
    closeModal();
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.more_modal')) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="list_view">
      {!diaryData || diaryData?.length === 0 ? (
        <NoContent />
      ) : (
        <ul className="diary_list_wrap">
          {diaryData.map(diary => (
            <li className="diary_list" key={diary.id}>
              <Link to={`/diary/${diary.id}`}>
                <div className="left_box">
                  <h5 className="title">{diary.title}</h5>
                  <p className="content">{diary.content}</p>
                  <span className="date">
                    {diary.postedAt.toDate().toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`main_img ${
                    diary.imgUrls.length > 1 ? 'many' : ''
                  }`}
                  style={{
                    backgroundImage: `url('${
                      diary.imgUrls && diary.imgUrls.length > 0
                        ? diary.imgUrls[0]
                        : ''
                    }')`,
                  }}
                ></div>
              </Link>
              <button
                className="more"
                onClick={event => {
                  event.stopPropagation();
                  toggleModal(diary);
                }}
              ></button>
              {isModalOpen && selectedDiary === diary && (
                <div className="more_modal">
                  <div
                    className="btn modify"
                    onClick={() => navigateToEdit(diary)}
                  >
                    게시글 수정
                  </div>
                  <div
                    className="btn delete"
                    onClick={() => {
                      showAlert('글을 삭제하시겠습니까?', '', () => {
                        handleDelete(diary.id);
                        closeModal();
                      });
                    }}
                  >
                    삭제
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListView;
