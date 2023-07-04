import { classNames } from '../sso/connections/types';

export default function IconButton({
  Icon,
  tooltip,
  onClick,
  className,
}: {
  Icon: any;
  tooltip: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <div className='tooltip' data-tip={tooltip}>
      <Icon
        className={classNames('hover:scale-115 h-5 w-5 cursor-pointer text-secondary', className)}
        onClick={onClick}
      />
    </div>
  );
}
