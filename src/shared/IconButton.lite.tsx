import { IconButtonProps } from './types';

export default function IconButton(props: IconButtonProps) {
  return (
    <div className='tooltip' data-tip={props.tooltip}>
      <props.Icon
        className={`hover:scale-115 h-5 w-5 cursor-pointer text-secondary ${
          props.className ? props.className : ''
        }`}
        onClick={() => props.onClick()}
      />
    </div>
  );
}
