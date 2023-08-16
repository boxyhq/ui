import { onUpdate } from '@builder.io/mitosis';
import { THEME } from './defaultTheme';

interface ThemerProps {
  overrideTheme?: Partial<typeof THEME>;
  children: any;
}

export default function Themer(props: ThemerProps) {
  onUpdate(() => {
    Object.entries({ ...THEME, ...props.overrideTheme }).forEach(([cssVar, value]) => {
      document.documentElement.style.setProperty(cssVar, value);
    });
  }, [props.overrideTheme]);

  return <div id='__themer'>{props.children}</div>;
}
