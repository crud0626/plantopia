import { FormEvent, useState } from 'react';
import { InitialDiaryContent } from '@/@types/diary.type';
import { showAlert } from '@/utils/dialog';
import SectionBoard from './SectionBoard';
import SectionPhoto from './SectionPhoto';

// props: onSubmit, 채울 데이터, plantNames
interface DiaryFormProps {
  callerType: 'write' | 'edit';
  plantNames: string[];
  oldContents: InitialDiaryContent | Pick<InitialDiaryContent, 'userEmail'>;
  onSubmit: (contents: InitialDiaryContent) => Promise<void>;
}

// 유효성 검사
const validateInput = (contents: InitialDiaryContent) => {
  const { title, tags, content } = contents;

  if (!title || tags.length === 0 || !content) {
    const msg = !title
      ? '제목을 작성해주세요.'
      : tags.length === 0
      ? '관련 식물을 1가지 이상 선택해주세요.'
      : '내용을 작성해주세요.';

    showAlert('error', msg);
    return false;
  }

  return true;
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isValid = validateInput(contents);

    if (!isValid) return;
    // 유효성 검사 실패했을 때 메세지 띄워주기

    try {
      setIsSubmitting(false);
      await onSubmit(contents);

      showAlert('success', '저장이 완료되었어요!');
    } catch (error) {
      showAlert('error', '실패하였습니다.');
    } finally {
      setIsSubmitting(true);
    }
  };

  const btnText = btnTextByType[callerType];

  return (
    <form onSubmit={handleSubmit}>
      <SectionPhoto
        imgUrls={contents.imgUrls || []}
        handleContents={() => {}}
      />
      <SectionBoard
        contents={contents}
        plantNames={plantNames}
        handleContents={handleContents}
        handleTags={handleTags}
      />
      <button>{btnText[Number(isSubmitting)]}</button>
    </form>
  );
};

export default DiaryForm;
