import styles from './index.module.css';


export interface IconButtonProps {
  children: any;
  label?: string;
  handleClick: (event: any) => void;
}

export default function IconButton(props: IconButtonProps) {

  // TODO: bring tooltip
  return (
    <button
      type='button'
      onClick={(event) => props.handleClick(event)}
      class={styles.btn}
      aria-label={props.label}>
      {props.children}
    </button>
  );
}
