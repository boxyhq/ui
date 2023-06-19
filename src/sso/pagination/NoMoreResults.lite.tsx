import { useStore } from '@builder.io/mitosis';

export default function NoMoreResults({ colSpan, translation }: { colSpan: number; translation: any }) {
  const state = useStore({
    get t() {
      const { t } = translation('common');
      return t;
    },
  });

  return (
    <tr>
      <td colSpan={colSpan} className='px-6 py-3 text-center text-sm text-gray-500'>
        {state.t('no_more_results')}
      </td>
    </tr>
  );
}
