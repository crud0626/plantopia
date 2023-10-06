import { useNavigate } from 'react-router-dom';
import './pageHeader.scss';

interface HeaderBeforeProps {
  exitBtn?: boolean;
  title: string;
}

const PageHeader = ({ exitBtn, title }: HeaderBeforeProps) => {
  const navigate = useNavigate();

  return (
    <header className="header_container inner">
      <div className={`btn_wrapper ${exitBtn ? 'hidden' : ''}`}>
        <button
          className="back_btn"
          onClick={() => navigate(-1)}
          aria-label="back"
        ></button>
      </div>
      <h2 className="header_title">{title}</h2>
      <div className={`btn_wrapper ${exitBtn ? '' : 'hidden'}`}>
        <button
          className="ex_btn"
          onClick={() => navigate(-1)}
          aria-label="exit"
        ></button>
      </div>
    </header>
  );
};

export default PageHeader;
