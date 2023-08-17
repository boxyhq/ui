import { LoadingContainerProps } from '../types';
import styles from './index.module.css';

// Reference: https://adrianroselli.com/2020/11/more-accessible-skeletons.html
export default function LoadingContainer(props: LoadingContainerProps) {
  return (
    <div class={styles.container}>
      <div class={styles.spinner} aria-hidden={!props.isBusy} aria-label='Loading'></div>
      <div aria-busy={props.isBusy}>{props.children}</div>
    </div>
  );
}
