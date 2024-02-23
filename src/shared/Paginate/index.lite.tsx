import { Show, onMount, onUnMount, useStore } from '@builder.io/mitosis';
import Button from '../Button/index.lite';
import { PaginateProps } from '../types';
import styles from './index.module.css';
import PaginateContext from './paginate.context.lite';

export default function Paginate(props: PaginateProps) {
  const state = useStore({
    _offset: 0,
    get isPaginationHidden(): boolean {
      return state._offset === 0 && props.currentPageItemsCount < props.itemsPerPage;
    },
    get isPreviousDisabled(): boolean {
      return state._offset === 0;
    },
    get isNextDisabled(): boolean {
      return props.currentPageItemsCount < props.itemsPerPage;
    },
    handlePreviousClick() {
      const currentOffset = state._offset;
      const newOffset = currentOffset - props.itemsPerPage;
      state._offset = newOffset;

      // Update query string in URL
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      // Trigger data re-fetch with new offset
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: newOffset,
          limit: props.itemsPerPage,
          pageToken: props.pageTokenMap[newOffset - props.itemsPerPage],
        });
    },
    handleNextClick() {
      const currentOffset = state._offset;
      const newOffset = currentOffset + props.itemsPerPage;
      state._offset = newOffset;
      // Update query string in URL
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: newOffset });
      // Trigger data re-fetch with new offset
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: newOffset,
          limit: props.itemsPerPage,
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
          limit: props.itemsPerPage,
        });
    } else {
      // console.log(`no offset found in url, setting offset to 0 in url`);
      typeof props.handlePageChange === 'function' && props.handlePageChange({ offset: 0 });
      // console.log(`fetching with offset 0`);
      typeof props.reFetch === 'function' &&
        props.reFetch({
          offset: 0,
          limit: props.itemsPerPage,
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
                icon='LeftArrowIcon'
                handleClick={state.handlePreviousClick}
                disabled={state.isPreviousDisabled}
                aria-label='Goto Previous Page'></Button>
            </li>
            <li>
              <Button
                name='Next'
                variant='outline'
                icon='RightArrowIcon'
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
