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
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<DiaryContentTypes | null>(
    null,
  );

  const toggleModal = (diary: DiaryContentTypes) => {
    setSelectedDiary(diary);
    setIsOpenModal(!isOpenModal);
  };

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (!(target instanceof HTMLElement)) return;

      if (!target.closest('.more_modal')) {
        setIsOpenModal(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const isEmpty = !diaryData || diaryData.length === 0;

  return (
    <div className="list_view">
      {isEmpty ? (
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
                    diary.imgUrls.length > 1 ? 'multiple' : ''
                  }`}
                >
                  {diary.imgUrls.length > 0 && (
                    <img src={diary.imgUrls[0]} alt="" />
                  )}
                </div>
              </Link>
              <button
                className="more"
                onClick={event => {
                  event.stopPropagation();
                  toggleModal(diary);
                }}
              ></button>
              {isOpenModal && selectedDiary === diary && (
                <div className="more_modal">
                  <div
                    className="btn modify"
                    onClick={() => navigate(`/diary/${diary.id}/edit`)}
                  >
                    게시글 수정
                  </div>
                  <div
                    className="btn delete"
                    onClick={() => {
                      showAlert('글을 삭제하시겠습니까?', '', () => {
                        handleDelete(diary.id);
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
