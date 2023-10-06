import { useState } from 'react';
import { ArrowImages } from '@/constants/diary';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { InitialDiaryContent } from '@/@types/diary.type';
import { valueof } from '@/@types';

import './sectionBoard.scss';

interface SectionBoardProps {
  contents: InitialDiaryContent;
  plantNames: string[];
  handleContents: (
    key: keyof InitialDiaryContent,
    value: valueof<InitialDiaryContent>,
  ) => void;
  handleTags: (targetTag: string) => void;
}

const SectionBoard = ({
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
    <div className="section_board">
      <section className="board">
        <div className="title_wrapper">
          <input
            type="text"
            placeholder="제목을 작성하세요."
            className="title"
            value={title}
            onChange={({ target }) => handleContents('title', target.value)}
          />
        </div>
        <div className="plant_select_wrapper">
          <div className="plant_select">
            {isEmptyTag ? (
              <div
                className="choose_text"
                onClick={() => setIsOpenDropdown(prev => !prev)}
              >
                식물을 선택하세요.
              </div>
            ) : (
              <div className="chosen_wrap">
                {tags.map(tagName => (
                  <div
                    key={tagName}
                    className="chosen_plant"
                    onClick={e => {
                      e.stopPropagation();
                      handleTags(tagName);
                    }}
                  >
                    {tagName}
                    <span className="cancel"></span>
                  </div>
                ))}
              </div>
            )}
            <div
              className="arrow_icon"
              onClick={() => setIsOpenDropdown(prev => !prev)}
            >
              <img
                src={
                  isOpenDropdown ? ArrowImages.ARROW_UP : ArrowImages.ARROW_DOWN
                }
                alt={isOpenDropdown ? 'Up' : 'Down'}
              />
            </div>
          </div>
          {isOpenDropdown && (
            <>
              <div className="plant_list">
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
                  className="choose_complete"
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
          className="content"
          placeholder="내용을 작성하세요."
          onChange={({ target }) => handleContents('content', target.value)}
        />
      </section>
    </div>
  );
};

export default SectionBoard;
