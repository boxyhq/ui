import { BadgeProps } from '../types';

export default function Badge(props: BadgeProps) {
  return (
    <div
      color={props.color}
      aria-label={props.ariaLabel}
      class={`rounded-md py-2 text-white ${props.className}`}>
      {props.children}
    </div>
  );
}
