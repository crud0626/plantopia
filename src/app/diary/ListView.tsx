import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { showConfirm } from '@/utils/dialog';
import { DiaryContentTypes } from '@/@types/diary.type';

import NoContent from './NoContent';
import styles from './listView.module.scss';
import paths from '@/constants/routePath';

interface ListViewProps {
  diaryData: DiaryContentTypes[] | null;
  handleDelete: (diaryId: string) => void;
}

const ListView = ({ diaryData, handleDelete }: ListViewProps) => {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<DiaryContentTypes | null>(
    null,
  );

  const toggleModal = (diary: DiaryContentTypes) => {
    setSelectedDiary(diary);
    setIsOpenModal(!isOpenModal);
  };

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (!(target instanceof HTMLElement)) return;

    if (!target.closest('.more_modal')) {
      setIsOpenModal(false);
    }
  };

  useOutsideClick(handleClickOutside);

  const isEmpty = !diaryData || diaryData.length === 0;

  return (
    <div className={styles.list_view}>
      {isEmpty ? (
        <NoContent />
      ) : (
        <ul className={styles.diary_list_wrap}>
          {diaryData.map(diary => (
            <li className={styles.diary_list} key={diary.id}>
              <Link href={`${paths.diary}/${diary.id}`}>
                <div className={styles.left_box}>
                  <h5 className={styles.title}>{diary.title}</h5>
                  <p className={styles.content}>{diary.content}</p>
                  <span className={styles.date}>
                    {diary.postedAt.toDate().toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`${styles.main_img} ${
                    diary.imgUrls.length > 1 ? styles.multiple : ''
                  }`}
                >
                  {diary.imgUrls.length > 0 && (
                    <img src={diary.imgUrls[0]} alt="" />
                  )}
                </div>
              </Link>
              <button
                className={styles.more}
                onClick={event => {
                  event.stopPropagation();
                  toggleModal(diary);
                }}
              ></button>
              {isOpenModal && selectedDiary === diary && (
                <div className={styles.more_modal}>
                  <div
                    className={`${styles.btn} ${styles.modify}`}
                    onClick={() =>
                      router.push(`${paths.diaryEdit}/${diary.id}`)
                    }
                  >
                    게시글 수정
                  </div>
                  <div
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => {
                      showConfirm('글을 삭제하시겠습니까?', () => {
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
