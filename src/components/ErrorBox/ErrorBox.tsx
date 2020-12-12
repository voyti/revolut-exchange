import './ErrorBox.scss';
interface ErrorBoxProps { error: string };

const ErrorBox = ({ error }: ErrorBoxProps) => {

  return (
    <div className="error-box">
      <span>{error}</span>
    </div>
  );
}

export default ErrorBox;
