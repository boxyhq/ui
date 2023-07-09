import type { SVGAttributes, Component } from 'vue';

export type SVGProps = SVGAttributes;

export interface IconButtonProps {
  Icon: Component<SVGProps>;
  label: string;
  onClick: (event: any) => void;
  iconClasses: string;
}
