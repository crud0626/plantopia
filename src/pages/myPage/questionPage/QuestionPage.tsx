import { Children, useState } from 'react';
import PageHeader from '@/components/pageHeader/PageHeader';
import Footer from '@/components/footer/Footer';
import styles from './questionPage.module.scss';

const contents = [
  {
    title: 'PWA가 무엇인가요?',
    content: `PWA(Progressive Web App)는 웹 페이지이지만 모바일 어플리케이션과 비슷한 사용자 경험을 제공하는 기술입니다.
모바일 및 데스크탑 환경에서 바탕화면에 아이콘을 추가할 수 있으며 해당 아이콘을 클릭하면 어플리케이션과 같이 동작합니다!`,
  },
  {
    title: '물 주기 버튼을 잘 못 눌렀어요!',
    content: `만약 물 주기 버튼을 잘못 눌렀다면, "내 식물" 탭에서 해당 식물을 클릭한 후, 식물 정보 수정 페이지에서 마지막으로 물을 준 날짜를 수정한 다음, 하단에 위치한 저장 버튼을 눌러주세요!`,
  },
  {
    title: '내가 찾는 식물이 없을땐 어떻게 하나요?',
    content: `화면 하단의 "식물 도감" 탭 또는 "식물 등록" 페이지에서 검색 결과가 없을 때 "내가 찾는 식물이 없다면, 식물 등록 요청하기" 버튼이 노출됩니다.
해당 버튼을 통해 구글 폼에 원하시는 식물의 이름을 입력한 뒤 제출해주세요! 해당 내용을 빠르게 검토한 뒤 추가해드릴게요!`,
  },
  {
    title: '문의 사항은 어떻게 남기나요?',
    content: `화면 하단의 "MY" 탭을 클릭하시면 "식물 추가 요청"이라는 버튼이 표시됩니다.해당 버튼을 통해 이동한 구글 폼에서 문의 사항 항목에 문의 내용 혹은 의견을 작성한 뒤 제출해 주세요.
여러분의 소중한 의견은 플랜토피아가 성장하는데 중요한 양분이 됩니다!`,
  },
];

const QuestionPage = () => {
  const [isOpenContent, setIsOpenContent] = useState<boolean[]>(
    new Array(contents.length).fill(false),
  );

  return (
    <>
      <PageHeader title="자주 묻는 질문" />
      <main className={styles.container}>
        <h2 className={styles.title}>궁금한 점이 있으신가요?</h2>
        <section className={`${styles.list_box} inner`}>
          <span className={styles.list_title}>Q&A</span>
          <ul className={styles.list_contents}>
            {Children.toArray(
              contents.map(({ title, content }, i) => (
                <li>
                  <button
                    className={`${isOpenContent[i] ? styles.open : ''}`}
                    onClick={() =>
                      setIsOpenContent(prev => {
                        const newState = [...prev];
                        newState[i] = !prev[i];
                        return newState;
                      })
                    }
                  >
                    {title}
                  </button>
                  {isOpenContent[i] && (
                    <div className={styles.content_wrapper}>
                      <p>{content}</p>
                    </div>
                  )}
                </li>
              )),
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default QuestionPage;
