import { onMount, useStore } from '@builder.io/mitosis';
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
      window.history.pushState({ ...window.history.state, as: url.toString(), url: url.toString() }, '', url);

      state.itemOffset = newOffset;
    },
    handlePreviousClick() {
      const newOffset = this.itemOffset - props.itemsPerPage;
      // update browser url
      state.updateURLOffset(newOffset);
      // call back to trigger refetch
      props.handlePageChange({ offset: newOffset });
    },
    handleNextClick() {
      const newOffset = this.itemOffset + props.itemsPerPage;
      // update browser url
      state.updateURLOffset(newOffset);
      // call back to trigger refetch
      props.handlePageChange({ offset: newOffset });
    },
  });

  onMount(() => {
    const offsetFromQueryParams = new URLSearchParams(window.location.search).get('offset');
    if (offsetFromQueryParams && Number.isFinite(+offsetFromQueryParams)) {
      state.offset = Math.abs(+offsetFromQueryParams);
    }
  });

  onUpdate(() => {
    typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: state.offset });
  }, [state.offset]);

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
