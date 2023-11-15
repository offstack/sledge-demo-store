const dots = 'mx-[1px] inline-block h-1 w-1 animate-blink rounded-md';

const LoadingDots = ({className}: {className: string}) => {
  return (
    <span className="mx-2 inline-flex items-center">
      <span className={`${dots} ${className}`} />
      <span className={`${dots} duration-200 ${className}`} />
      <span className={`${dots} duration-[400ms] ${className}`} />
    </span>
  );
};

export default LoadingDots;
