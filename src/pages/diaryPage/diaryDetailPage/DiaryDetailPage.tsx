import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteDiary, getUserDiary } from '@/api/userDiary';
import { useAuth } from '@/hooks';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { showAlert, showConfirm } from '@/utils/dialog';
import { DiaryContentTypes } from '@/@types/diary.type';
import paths from '@/constants/routePath';

import PageHeader from '@/components/pageHeader/PageHeader';
import Progress from '@/components/progress/Progress';
import DetailSlide from './DetailSlide';
import styles from './diaryDetailPage.module.scss';

const DiaryDetailPage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryDetailData, setDiaryDetailData] =
    useState<DiaryContentTypes | null>(null);

  const handleDelete = async (diaryId: string) => {
    if (!user?.email) return;

    setIsLoading(true);

    try {
      await deleteDiary(diaryId);

      showAlert('success', '삭제가 완료되었어요!');
      navigate(paths.diary);
    } catch (error) {
      showAlert('error', '다이어리 삭제 도중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutsideClick = ({ target }: MouseEvent) => {
    if (!(target instanceof HTMLElement)) return;

    if (!target.closest('.more_btn_wrap')) {
      setIsModalOpen(false);
    }
  };

  useOutsideClick(handleOutsideClick);

  useEffect(() => {
    (async () => {
      if (!docId) {
        navigate(paths.diary);
        return;
      }

      try {
        setIsLoading(true);

        const diaryData = await getUserDiary(docId);
        if (!diaryData) throw Error();

        setDiaryDetailData(diaryData);
      } catch (error) {
        showAlert('error', '존재하지 않는 다이어리입니다.');
        navigate(paths.diary);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [docId]);

  if (!docId || !diaryDetailData) return null;

  const { content, postedAt, tags, title, imgUrls } = diaryDetailData;

  return (
    <div className={`${styles.container} layout`}>
      <PageHeader title="다이어리" />
      <div className={styles.more_btn_wrap}>
        <button
          className={styles.more}
          onClick={() => setIsModalOpen(prev => !prev)}
        ></button>
        {isModalOpen && (
          <div className={styles.more_modal}>
            <button
              className={`${styles.btn} ${styles.modify}`}
              onClick={() => navigate(`${paths.diaryEdit}/${docId}`)}
            >
              게시글 수정
            </button>
            <button
              className={`${styles.btn} ${styles.delete}`}
              onClick={() => {
                showConfirm('글을 삭제하시겠습니까?', async () => {
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
      <main className={styles.diary_detail_page}>
        <div className={styles.diary_detail_container}>
          {imgUrls.length > 0 && <DetailSlide imgUrls={imgUrls} />}
          <section className={`${styles.content_section} inner`}>
            <h5 className={styles.diary_title}>{title}</h5>
            <div className={styles.plant_list}>
              {tags.map((tag, i) => (
                <span key={i}>{tag}</span>
              ))}
            </div>
            <div className={styles.text_wrap}>
              <p className={styles.diary_text}>{content}</p>
              <p className={styles.diary_date}>
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
