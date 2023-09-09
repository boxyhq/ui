import styles from "./index.module.css";

export default function Checkbox(props: { label: string, name: string, checked: boolean, handleChange: (e: any) => void }) {
    return <label class={styles.label}>
        <input type="checkbox" name={props.name} checked={props.checked} onChange={(event) => props.handleChange(event)} class={styles.checkbox} />
        {props.label}
    </label>
}