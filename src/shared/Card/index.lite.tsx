import { CardProps } from '../types';
import defaultStyles from './index.module.css';

export default function Card(props: CardProps) {
  return (
    <article class={defaultStyles.container}>
      <h3 class={defaultStyles.title}>{props.title}</h3>
      <p class={defaultStyles.body}>{props.children}</p>
    </article>
  );
}
