import styles from "./index.module.css";

// Adds a rounded border around some content
export default function Well(props: { children?: any }) {
    return <div class={styles.well}>{props.children}</div>
}