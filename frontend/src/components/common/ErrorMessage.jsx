import { HiExclamationTriangle } from 'react-icons/hi2';

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3 py-8 text-center">
    <HiExclamationTriangle className="w-10 h-10 text-red-400" />
    <p className="text-red-300 text-sm max-w-md">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm px-4 py-2">
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
