import { BadgeProps } from '../types';

export default function Badge(props: BadgeProps) {
  return (
    <span color={props.color} aria-label={props.ariaLabel} class={`rounded-md py-2 ${props.className}`}>
      {props.children}
    </span>
  );
}
