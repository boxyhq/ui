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
    updateURLOffset(newOffset: number) {
      // Get the current URL
      var url = new URL(window.location.toString());

      // Set or update the query string parameter
      url.searchParams.set('offset', `${newOffset}`);

      // Push the updated URL to the browser history
      window.history.pushState({}, '', url);
    },
    handlePreviousClick() {
      const newOffset = this.itemOffset - props.itemsPerPage;
      state.updateURLOffset(newOffset);
      props.handlePageChange({ offset: newOffset });
    },
    handleNextClick() {
      const newOffset = this.itemOffset + props.itemsPerPage;
      state.updateURLOffset(newOffset);
      props.handlePageChange({ offset: newOffset });
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
