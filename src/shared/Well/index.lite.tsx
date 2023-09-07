import { JSX } from "@builder.io/mitosis/jsx-runtime";
import styles from "./index.module.css";

// Adds a rounded border around some content
export default function Well(props: { children: JSX.Element }) {
    return <div class={styles.well}>{props.children}</div>
}