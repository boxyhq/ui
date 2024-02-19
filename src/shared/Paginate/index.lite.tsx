import { Show, onMount, onUnMount, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';
import { ITEMS_PER_PAGE_DEFAULT } from './utils';
import styles from './index.module.css';
import PaginateContext from './paginate.context.lite';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    _offset: 0,
    get _itemsPerPage() {
      return props.itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT;
    },
    get isPaginationHidden(): boolean {
      return state._offset === 0 && props.currentPageItemsCount < state._itemsPerPage;
    },
    get isPreviousDisabled(): boolean {
      return state._offset === 0;
    },
    get isNextDisabled(): boolean {
      return props.currentPageItemsCount < state._itemsPerPage;
    },
    handlePreviousClick() {
      const currentOffset = state._offset;
      const newOffset = currentOffset - state._itemsPerPage;
      state._offset = newOffset;

      // Update query string in URL
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      // Trigger data re-fetch with new offset
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: newOffset,
          limit: state._itemsPerPage,
          pageToken: props.pageTokenMap[newOffset - state._itemsPerPage],
        });
    },
    handleNextClick() {
      const currentOffset = state._offset;
      const newOffset = currentOffset + state._itemsPerPage;
      state._offset = newOffset;
      // Update query string in URL
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      // Trigger data re-fetch with new offset
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: newOffset,
          limit: state._itemsPerPage,
          pageToken: props.pageTokenMap[currentOffset],
        });
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
    if (typeof _offsetFromBrowserQS === 'number') {
      // console.log(`offset ${_offsetFromBrowserQS} found in url`);
      state._offset = _offsetFromBrowserQS;
      // console.log(`fetching with offset ${_offsetFromBrowserQS}`);
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: _offsetFromBrowserQS,
          limit: state._itemsPerPage,
        });
    } else {
      // console.log(`no offset found in url, setting offset to 0 in url`);
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: 0 });
      // console.log(`fetching with offset 0`);
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: 0,
          limit: state._itemsPerPage,
        });
    }
  }

  onMount(() => {
    // console.log(`adding popstate event listener`);
    window.addEventListener('popstate', reFetchUsingBrowserQS);
    reFetchUsingBrowserQS();
  });

  onUnMount(() => {
    // console.log(`removing popstate event listener`);
    window.removeEventListener('popstate', reFetchUsingBrowserQS);
  });

  return (
    <PaginateContext.Provider value={{ offset: state._offset }}>
      {props.children}
      <Show when={!state.isPaginationHidden}>
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
      </Show>
    </PaginateContext.Provider>
  );
}
