import { SpinnerProps } from '../types';
import styles from './index.module.css';

export default function Spinner(props: SpinnerProps) {
  return <div class={styles.spinner} aria-hidden={!props.isLoading} aria-label='Loading'></div>;
}
