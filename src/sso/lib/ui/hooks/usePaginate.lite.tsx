import { useState, useStore, onMount, onUpdate } from '@builder.io/mitosis';

export default function usePaginate({ router }: { router: any }) {
  const [offset, setOffset] = useState(router.query.offset ? Number(router.query.offset) : 0);

  const state = useStore({
    paginate: { offset },
    // store that maps the pageToken for the next page with the current offset
    pageTokenMap: {},
  });

  onMount(() => {
    // Prevent pushing the same URL to the history
    if (offset === state.paginate.offset) {
      return;
    }

    const path = router.asPath.split('?')[0];

    router.push(`${path}?offset=${state.paginate.offset}`, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  onUpdate(() => {
    // Prevent pushing the same URL to the history
    if (offset === state.paginate.offset) {
      return;
    }

    const path = router.asPath.split('?')[0];

    router.push(`${path}?offset=${state.paginate.offset}`, undefined, { shallow: true });
  }, [state.paginate]);

  return {
    paginate: state.paginate,
    pageTokenMap: state.pageTokenMap,
  };
}
