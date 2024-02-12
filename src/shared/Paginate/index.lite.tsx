import { onMount, onUpdate, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';
import { ITEMS_PER_PAGE_DEFAULT } from './utils';
import styles from './index.module.css';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    _offset: 0,
    get isPreviousDisabled(): boolean {
      return state._offset === 0;
    },
    get isNextDisabled() {
      return props.currentPageItemsCount < props.itemsPerPage!;
    },
    handlePreviousClick() {
      const newOffset = state._offset - props.itemsPerPage!;
      state._offset = newOffset;
      // Update query string in URL
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      // Trigger data re-fetch with new offset
      typeof props.reFetch === 'function' &&
        props.reFetch({ offset: newOffset, limit: props.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT });
    },
    handleNextClick() {
      const newOffset = state._offset + props.itemsPerPage!;
      state._offset = newOffset;
      // Update query string in URL
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      // Trigger data re-fetch with new offset
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

  function reFetchUsingBrowserQS() {
    const _offsetFromBrowserQS = offsetFromBrowserQS();
    if (typeof _offsetFromBrowserQS === 'number' && state._offset !== _offsetFromBrowserQS) {
      // console.log(`triggering refetch for offset=${_offsetFromBrowserQS},state._offset=${state._offset}`);
      state._offset = _offsetFromBrowserQS;
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: _offsetFromBrowserQS,
          limit: props.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT,
        });
      return true;
    }
    return false;
  }

  onMount(() => {
    if (!reFetchUsingBrowserQS()) {
      // set offset to 0 in qs
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: 0 });
    }
  });

  onUpdate(() => {
    // console.log(`adding popstate event listener for ${state._offset}`);
    window.addEventListener('popstate', reFetchUsingBrowserQS);
    return () => {
      // console.log(`removing popstate event listener for ${state._offset}`);
      window.removeEventListener('popstate', reFetchUsingBrowserQS);
    };
  }, [state._offset]);

  return (
    <nav aria-label='Pagination Navigation'>
      <ul class={styles.ul}>
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
