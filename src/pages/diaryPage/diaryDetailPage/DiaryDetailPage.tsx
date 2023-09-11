import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiaryProps } from '@/@types/diary.type';
import { errorNoti, showAlert, successNoti } from '@/utils/alarmUtil';
import { deleteDiary, getUserDiary } from '@/api/userDiary';
import { useAuth } from '@/hooks';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import Progress from '@/components/progress/Progress';
import DetailSlide from './DetailSlide';
import './diaryDetailPage.scss';

const DiaryDetailPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryDetailData, setDiaryDetailData] = useState<DiaryProps | null>(
    null,
  );

  const handleDelete = async (diaryId: string) => {
    if (!user?.email) return;

    setIsLoading(true);

    try {
      await deleteDiary(diaryId);

      successNoti('삭제가 완료되었어요!');
      navigate('/diary');
    } catch (error) {
      errorNoti('다이어리 삭제 도중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!docId) {
        navigate('/diary');
        return;
      }

      try {
        setIsLoading(true);

        const diaryData = await getUserDiary(docId);
        if (!diaryData) throw Error();

        setDiaryDetailData(diaryData);
      } catch (error) {
        errorNoti('존재하지 않는 다이어리입니다.');
        navigate('/diary');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [docId]);

  useEffect(() => {
    const handleOutsideClick = ({ target }: MouseEvent) => {
      if (!target || !(target instanceof HTMLElement)) return;

      if (isModalOpen && !target.closest('.more_btn_wrap')) {
        setIsModalOpen(false);
      }
    };

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  if (!docId || !diaryDetailData) return null;

  const { content, postedAt, tags, title, imgUrls } = diaryDetailData;

  return (
    <div className="diary_detail_wrap layout">
      <HeaderBefore title="다이어리" />
      <div className="more_btn_wrap">
        <button
          className="more"
          onClick={() => setIsModalOpen(prev => !prev)}
        ></button>
        {isModalOpen && (
          <div className="more_modal">
            <button
              className="btn modify"
              onClick={() => navigate(`/diary/${docId}/edit`)}
            >
              게시글 수정
            </button>
            <button
              className="btn delete"
              onClick={() => {
                showAlert('글을 삭제하시겠습니까?', '', async () => {
                  await handleDelete(docId);
                  setIsModalOpen(false);
                });
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <main className="diary_detail_page">
        <div className="diary_detail_container">
          {imgUrls.length > 0 && <DetailSlide imgUrls={imgUrls} />}
          <section className="content_section inner">
            <h5 className="diary_title">{title}</h5>
            <div className="plant_list">
              {tags.map((tag, i) => (
                <span key={i}>{tag}</span>
              ))}
            </div>
            <div className="text_wrap">
              <p className="diary_text">{content}</p>
              <p className="diary_date">
                {postedAt.toDate().toLocaleDateString()}
              </p>
            </div>
          </section>
        </div>
        {isLoading && <Progress />}
      </main>
    </div>
  );
};

export default DiaryDetailPage;
