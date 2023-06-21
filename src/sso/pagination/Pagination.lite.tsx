import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import { ButtonOutline } from './ButtonOutline';
import { useStore, Show } from '@builder.io/mitosis';

type PaginationProps = {
  itemsCount: number;
  offset: number;
  translation: any;
  onPrevClick: () => void;
  onNextClick: () => void;
};

export const pageLimit = 15;

export default function Pagination({
  itemsCount,
  offset,
  translation,
  onPrevClick,
  onNextClick,
}: PaginationProps) {
  const state = useStore({
    get t() {
      return translation;
    },
    prevDisabled: offset === 0,
    nextDisabled: itemsCount < pageLimit || itemsCount === 0,
  });

  return (
    <div>
      <Show
        when={(itemsCount === 0 && offset === 0) || (itemsCount < pageLimit && offset === 0)}
        else={
          <div className='flex justify-center space-x-4 py-4'>
            <ButtonOutline
              Icon={ArrowLeftIcon}
              aria-label={state.t('previous')}
              onClick={() => onPrevClick}
              disabled={state.prevDisabled}>
              {state.t('prev')}
            </ButtonOutline>
            <ButtonOutline
              Icon={ArrowRightIcon}
              aria-label={state.t('previous')}
              onClick={() => onNextClick}
              disabled={state.nextDisabled}>
              {state.t('next')}
            </ButtonOutline>
          </div>
        }>
        <div className='hidden'></div>
      </Show>
    </div>
  );
}
