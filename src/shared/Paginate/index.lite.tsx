import { useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    itemOffset: 0,
    get isPreviousDisabled() {
      return this.itemOffset === 0;
    },
    get isNextDisabled() {
      return props.currentPageItemsCount < props.itemsPerPage;
    },
    handlePreviousClick() {
      props.handlePageChange({ offset: this.itemOffset - props.itemsPerPage });
    },
    handleNextClick() {
      props.handlePageChange({ offset: this.itemOffset + props.itemsPerPage });
    },
  });

  return (
    <nav aria-label='Pagination Navigation'>
      <ul>
        <li>
          <Button
            name='Prev'
            variant='outline'
            handleClick={state.handlePreviousClick}
            disabled={state.isPreviousDisabled}
            aria-label='Goto Previous Page'></Button>
        </li>
        <li>
          <Button
            name='Next'
            variant='outline'
            handleClick={state.handleNextClick}
            disabled={state.isNextDisabled}
            aria-label='Goto Next Page'></Button>
        </li>
      </ul>
    </nav>
  );
}
