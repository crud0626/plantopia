import { FormEvent, useMemo, useState } from 'react';
import { showAlert } from '@/utils/dialog';
import { InitialDiaryContent } from '@/@types/diary.type';

import styles from './diaryForm.module.scss';
import BoardSection from './BoardSection';
import PhotoSection from './PhotoSection';

interface DiaryFormProps {
  callerType: 'write' | 'edit';
  plantNames: string[];
  oldContents: InitialDiaryContent | Pick<InitialDiaryContent, 'userEmail'>;
  onSubmit: (contents: InitialDiaryContent) => Promise<void>;
}

const validateInput = (contents: InitialDiaryContent): [boolean, string] => {
  const { title, tags, content } = contents;

  if (!title || tags.length === 0 || !content) {
    const message = !title
      ? '제목을 작성해주세요.'
      : tags.length === 0
      ? '관련 식물을 1가지 이상 선택해주세요.'
      : '내용을 작성해주세요.';

    return [false, message];
  }

  return [true, ''];
};

const btnTextByType: { [type in DiaryFormProps['callerType']]: string[] } = {
  write: ['저장하기', '저장 중...'],
  edit: ['수정하기', '수정 중...'],
};

const initialContents: Omit<InitialDiaryContent, 'userEmail'> = {
  title: '',
  content: '',
  tags: [],
  imgUrls: [],
};

const DiaryForm = ({
  callerType,
  oldContents,
  plantNames,
  onSubmit,
}: DiaryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contents, setContents] = useState<InitialDiaryContent>({
    ...initialContents,
    ...oldContents,
  });

  const handleTags = (targetTag: string) => {
    if (!contents) return;

    const prevTags = [...contents.tags];
    const hasTarget = prevTags.includes(targetTag);

    const newTags = hasTarget
      ? prevTags.filter(name => name !== targetTag)
      : [...prevTags, targetTag];

    setContents({
      ...contents,
      tags: newTags,
    });
  };

  const handleContents = (
    key: keyof InitialDiaryContent,
    value: InitialDiaryContent[typeof key],
  ) => {
    if (!contents) return;

    setContents({
      ...contents,
      [key]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const [isValid, errMsg] = validateInput(contents);

    if (!isValid) {
      showAlert('error', errMsg);
      return;
    }

    setIsSubmitting(true);

    onSubmit(contents).finally(() => setIsSubmitting(false));
  };

  const btnText = useMemo(() => btnTextByType[callerType], [callerType]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <PhotoSection
        imgUrls={contents.imgUrls}
        handleContents={handleContents}
      />
      <BoardSection
        contents={contents}
        plantNames={plantNames}
        handleContents={handleContents}
        handleTags={handleTags}
      />
      <button className={styles.submit_btn}>
        {btnText[Number(isSubmitting)]}
      </button>
    </form>
  );
};

export default DiaryForm;
