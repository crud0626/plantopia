import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { DiaryProps } from '@/@types/diary.type';
import { errorNoti, showAlert, successNoti } from '@/utils/alarmUtil';
import { deleteDiary, getUserDiary } from '@/api/userDiary';
import { useAuth } from '@/hooks';

import HeaderBefore from '@/components/headerBefore/HeaderBefore';
import './diaryDetailPage.scss';

const DiaryDetailPage = () => {
  const user = useAuth();
  const { docId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const slideSectionPrevBtn = useRef<HTMLDivElement>(null);
  const slideSectionNextBtn = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryDetailData, setDiaryDetailData] = useState<DiaryProps | null>(
    null,
  );

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToEdit = () => {
    navigate(`/diary/${docId}/edit`);
    closeModal();
  };

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
      if (!docId) return;

      try {
        const diaryData = await getUserDiary(docId);
        if (diaryData) {
          setDiaryDetailData(diaryData);
        }
      } catch (error) {
        errorNoti('잘못된 접근입니다');
        navigate('/diary');
      }
    })();
  }, [docId]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;

      if (isModalOpen && !targetElement.closest('.more_btn_wrap')) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isModalOpen]);

  if (!docId) return null;

  return (
    <div className="diary_detail_wrap layout">
      <HeaderBefore ex={false} title="다이어리" />
      <div className="more_btn_wrap">
        <button
          className="more"
          onClick={() => {
            setIsModalOpen(!isModalOpen);
          }}
        ></button>
        {isModalOpen && (
          <div className="more_modal">
            <div className="btn modify" onClick={navigateToEdit}>
              게시글 수정
            </div>
            <div
              className="btn delete"
              onClick={() => {
                showAlert('글을 삭제하시겠습니까?', '', async () => {
                  await handleDelete(docId);
                  closeModal();
                });
              }}
            >
              삭제
            </div>
          </div>
        )}
      </div>
      <main className="diary_detail_page">
        <div className="diary_detail_container">
          {diaryDetailData &&
            diaryDetailData.imgUrls &&
            diaryDetailData.imgUrls.length > 0 && (
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
                  {diaryDetailData.imgUrls.map((imgUrl, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide_container">
                        <img
                          src={imgUrl}
                          className="slide_img"
                          alt="슬라이드 이미지"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="swiper_nav">
                    <div
                      ref={slideSectionPrevBtn}
                      className="swiper_nav_prev nav_btn"
                    >
                      <div className="prev_btn"></div>
                    </div>
                    <div
                      ref={slideSectionNextBtn}
                      className="swiper_nav_next nav_btn"
                    >
                      <div className="next_btn"></div>
                    </div>
                  </div>
                </Swiper>
              </section>
            )}

          <section className="content_section inner">
            <h5 className="diary_title">{diaryDetailData?.title}</h5>
            <div className="plant_list">
              {diaryDetailData?.tags.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </div>
            <div className="text_wrap">
              <p className="diary_text">{diaryDetailData?.content}</p>
              <p className="diary_date">
                {diaryDetailData?.postedAt?.toDate().toLocaleDateString()}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DiaryDetailPage;
