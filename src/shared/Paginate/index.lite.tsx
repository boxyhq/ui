import { onMount, onUpdate, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    offset: 0,
    get isPreviousDisabled(): boolean {
      return state.offset === 0;
    },
    get isNextDisabled() {
      return props.currentPageItemsCount < props.itemsPerPage;
    },
    handlePreviousClick() {
      state.offset = state.offset - props.itemsPerPage;
    },
    handleNextClick() {
      state.offset = state.offset + props.itemsPerPage;
    },
  });

  function offsetInBrowserQS() {
    const offsetFromQueryParams = new URLSearchParams(window.location.search).get('offset');
    if (offsetFromQueryParams && Number.isFinite(+offsetFromQueryParams)) {
      return Math.abs(+offsetFromQueryParams);
    }
    return null;
  }

  onMount(() => {
    const _offsetInBrowserQS = offsetInBrowserQS();
    if (typeof _offsetInBrowserQS === 'number' && state.offset !== _offsetInBrowserQS) {
      state.offset = _offsetInBrowserQS;
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
