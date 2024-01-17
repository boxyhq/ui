import { useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    itemOffset: 0,
    get isPreviousDisabled() {
      return state.itemOffset === 0;
    },
    get isNextDisabled() {
      return props.currentPageItemsCount < props.itemsPerPage;
    },
  });

  return (
    <nav aria-label='Pagination Navigation'>
      <ul>
        <li>
          <Button
            name='Prev'
            variant='outline'
            handleClick={props.handlePreviousClick}
            disabled={state.isPreviousDisabled}
            aria-label='Goto Previous Page'></Button>
        </li>
        <li>
          <Button
            name='Next'
            variant='outline'
            handleClick={props.handleNextClick}
            disabled={state.isNextDisabled}
            aria-label='Goto Next Page'></Button>
        </li>
      </ul>
    </nav>
  );
}
