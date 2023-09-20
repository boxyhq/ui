import { For, Fragment, useStore } from "@builder.io/mitosis";
import styles from "./index.module.css"

interface SelectProps {
    label: string;
    options: Array<{ value: string, text: string }>
}
export default function Select(props: SelectProps) {
    const state = useStore({
        id: props.label.replace(/ /g, ''),
    })

    return (
        <Fragment>
            <label htmlFor={state.id}>{props.label}</label>
            <div class={styles.div}>
                <select id={state.id} class={styles.select}>
                    <For each={props.options}>
                        {(optionItem) => (
                            <option value={optionItem.value}>{optionItem.text}
                            </option>
                        )
                        }
                    </For>
                </select>
                <span class={styles.focus}></span>
            </div>
        </Fragment>)
}