import { onMount, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';
import { ITEMS_PER_PAGE_DEFAULT } from './utils';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    offset: 0,
    get isPreviousDisabled(): boolean {
      return state.offset === 0;
    },
    get isNextDisabled() {
      return props.currentPageItemsCount < props.itemsPerPage!;
    },
    handlePreviousClick() {
      const newOffset = state.offset - props.itemsPerPage!;
      state.offset = newOffset;
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      typeof props.reFetch === 'function' &&
        props.reFetch({ offset: newOffset, limit: props.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT });
    },
    handleNextClick() {
      const newOffset = state.offset + props.itemsPerPage!;
      state.offset = newOffset;
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      typeof props.reFetch === 'function' &&
        props.reFetch({ offset: newOffset, limit: props.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT });
    },
  });

  function offsetFromBrowserQS() {
    const offsetFromQueryParams = new URLSearchParams(window.location.search).get('offset');
    if (offsetFromQueryParams && Number.isFinite(+offsetFromQueryParams)) {
      return Math.abs(+offsetFromQueryParams);
    }
    return null;
  }

  onMount(() => {
    const _offsetFromBrowserQS = offsetFromBrowserQS();
    if (typeof _offsetFromBrowserQS === 'number' && state.offset !== _offsetFromBrowserQS) {
      state.offset = _offsetFromBrowserQS;
      typeof props.reFetch === 'function' &&
        props.reFetch({ offset: _offsetFromBrowserQS, limit: props.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT });
    } else {
      // set offset to 0 in qs
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: 0 });
    }
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
