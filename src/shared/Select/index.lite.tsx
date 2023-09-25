import { For, Fragment, useStore } from "@builder.io/mitosis";
import styles from "./index.module.css"
import Spacer from "../Spacer/index.lite";

interface SelectProps {
    label: string;
    name: string;
    options: Array<{ value: string, text: string }>;
    disabled?: boolean;
    selectedValue: string;
    handleChange: (event: any) => void;
}
export default function Select(props: SelectProps) {
    const state = useStore({
        get id() { return props.label.replace(/ /g, '') },
        get divCss() {
            return styles.div + (props.disabled ? ` ${styles["div--disabled"]}` : '')
        },
    })

    return (
        <Fragment>
            <label htmlFor={state.id} class={styles.label}>{props.label}</label>
            <Spacer y={2} />
            <div class={state.divCss}>
                <select id={state.id} name={props.name} class={styles.select} disabled={props.disabled ?? false} value={props.selectedValue} onChange={(event) => props.handleChange(event)}>
                    <For each={props.options}>
                        {(optionItem) => (
                            <option value={optionItem.value} key={optionItem.value}>{optionItem.text}
                            </option>
                        )
                        }
                    </For>
                </select>
                <span class={styles.focus}></span>
            </div>
        </Fragment>)
}