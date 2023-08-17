import styles from './index.module.css';

interface SeparatorProps {
  text?: string;
}

export default function Separator(props: SeparatorProps) {
  return <div class={styles.separator}>{props.text}</div>;
}
