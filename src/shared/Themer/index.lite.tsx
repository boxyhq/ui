import { onUpdate } from '@builder.io/mitosis';
import type { Theme } from './types';

interface ThemerProps {
  overrideTheme?: Partial<Theme>;
  children: any;
}

export default function Themer(props: ThemerProps) {
  onUpdate(() => {
    Object.entries({ ...props.overrideTheme }).forEach(([cssVar, value]) => {
      document.documentElement.style.setProperty(cssVar, value);
    });
  }, [props.overrideTheme]);

  return <div id='__themer'>{props.children}</div>;
}
