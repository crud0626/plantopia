import { useState } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { InitialDiaryContent } from '@/@types/diary.type';
import { valueof } from '@/@types';

import styles from './boardSection.module.scss';

interface SectionBoardProps {
  contents: InitialDiaryContent;
  plantNames: string[];
  handleContents: (
    key: keyof InitialDiaryContent,
    value: valueof<InitialDiaryContent>,
  ) => void;
  handleTags: (targetTag: string) => void;
}

const BoardSection = ({
  contents,
  handleContents,
  plantNames,
  handleTags,
}: SectionBoardProps) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (!(target instanceof HTMLElement)) return;

    if (!target.closest('.plant_select_wrapper')) {
      setIsOpenDropdown(false);
    }
  };

  useOutsideClick(handleClickOutside);

  const { title, tags, content } = contents;

  const isEmptyTag = tags.length === 0;

  return (
    <div className={styles.container}>
      <section className={styles.board}>
        <div className={styles.title_wrapper}>
          <input
            type="text"
            placeholder="제목을 작성하세요."
            className={styles.title}
            value={title}
            onChange={({ target }) => handleContents('title', target.value)}
          />
        </div>
        <div className={`${styles.plant_select_wrapper} plant_select_wrapper`}>
          <div
            className={styles.plant_select}
            onClick={() => setIsOpenDropdown(prev => !prev)}
          >
            {isEmptyTag ? (
              <div className={styles.choose_text}>식물을 선택하세요.</div>
            ) : (
              <div className={styles.chosen_wrap}>
                {tags.map(tagName => (
                  <div
                    key={tagName}
                    className={styles.chosen_plant}
                    onClick={e => {
                      e.stopPropagation();
                      handleTags(tagName);
                    }}
                  >
                    {tagName}
                    <span className={styles.cancel}></span>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              className={`${styles.toggle} ${
                isOpenDropdown ? styles.open : ''
              }`}
            ></button>
          </div>
          {isOpenDropdown && (
            <>
              <div className={styles.plant_list}>
                <ul>
                  {plantNames.map(plantName => (
                    <li key={plantName}>
                      <input
                        type="checkbox"
                        id={plantName}
                        name={plantName}
                        value={plantName}
                        onChange={() => handleTags(plantName)}
                        checked={tags.includes(plantName)}
                      />
                      <label htmlFor={plantName}>{plantName}</label>
                    </li>
                  ))}
                </ul>
                <button
                  className={styles.choose_complete}
                  onClick={() => setIsOpenDropdown(prev => !prev)}
                >
                  선택 완료
                </button>
              </div>
            </>
          )}
        </div>
        <textarea
          value={content}
          className={styles.content}
          placeholder="내용을 작성하세요."
          onChange={({ target }) => handleContents('content', target.value)}
        />
      </section>
    </div>
  );
};

export default BoardSection;
