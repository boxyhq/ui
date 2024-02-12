import { setContext, useContext, useStore } from '@builder.io/mitosis';
import PaginateContext from './paginate.context.lite';
import Button from '../Button/index.lite';

export default function PaginateContainer(props: { children?: any }) {
  const context = useContext(PaginateContext);

  const state = useStore({
    counter: 0,
    increment() {
      state.counter = state.counter + 1;
    },
  });

  return (
    <PaginateContext.Provider value={{ offset: state.counter }}>
      {props.children}
      <Button name='increment' handleClick={state.increment}></Button>
      <span>{context.offset}</span>
    </PaginateContext.Provider>
  );
}
