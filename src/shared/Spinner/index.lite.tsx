import styles from './index.module.css';

export default function Spinner() {
  return <div class={styles.spinner} aria-hidden={true} aria-label='Loading'></div>;
}
