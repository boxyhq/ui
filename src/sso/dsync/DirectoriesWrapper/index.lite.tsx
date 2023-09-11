import { useStore, Show } from '@builder.io/mitosis';
import type { Directory } from '../types';

const DEFAULT_VALUES = {
  directoryListData: [] as Directory[],
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
};

export default function DirectoriesWrapper() {
  const state = useStore({
    directories: DEFAULT_VALUES.directoryListData,
    view: DEFAULT_VALUES.view,
    directoryToEdit: {} as Directory,
    switchToCreateView() {
      state.view = 'CREATE';
    },
    switchToEditView(action: 'edit', directory: any) {
      state.view = 'EDIT';
      state.directoryToEdit = directory;
    },
    switchToListView() {
      state.view = 'LIST';
    },
    logError(err: string) {
      console.error(err);
    },
  });

  return (
    <div>
      <div class='flex flex-col'>
        <Show when={state.view === 'LIST'}></Show>
      </div>
      <Show when={state.view === 'EDIT'}></Show>
      <Show when={state.view === 'CREATE'}></Show>
    </div>
  );
}
