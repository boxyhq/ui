import { useStore, Show } from '@builder.io/mitosis';
import type { Directory, DirectoriesWrapperProps } from '../types';
import CreateDirectory from '../CreateDirectory/index.lite';
import Spacer from '../../shared/Spacer/index.lite';
import EditDirectory from '../EditDirectory/index.lite';
import DirectoryList from '../DirectoryList/index.lite';
import Button from '../../shared/Button/index.lite';
import styles from './index.module.css';

const DEFAULT_VALUES = {
  directoryListData: [] as Directory[],
  view: 'LIST' as 'LIST' | 'EDIT' | 'CREATE',
  directoryToEdit: {} as Directory,
};

export default function DirectoriesWrapper(props: DirectoriesWrapperProps) {
  const state = useStore({
    directories: DEFAULT_VALUES.directoryListData,
    view: DEFAULT_VALUES.view,
    handleListFetchComplete: (directoryList: Directory[]) => {
      state.directories = directoryList;
    },
    get directoriesAdded(): boolean {
      return state.directories.length > 0;
    },
    get dsyncEnabled(): boolean {
      return state.directoriesAdded && state.directories.some((directory) => directory.deactivated === false);
    },
    directoryToEdit: DEFAULT_VALUES.directoryToEdit,
    get directoryFetchURL(): string {
      let _url = props.urls.get;
      const [urlPath, qs] = _url.split('?');
      const urlParams = new URLSearchParams(qs);
      if (urlParams.toString()) {
        return `${urlPath}/${state.directoryToEdit.id}?${urlParams}`;
      }
      return `${urlPath}/${state.directoryToEdit.id}`;
    },
    switchToCreateView() {
      state.view = 'CREATE';
    },
    switchToEditView(action: 'edit' | 'view', directory: any) {
      state.view = 'EDIT';
      state.directoryToEdit = directory;
    },
    switchToListView() {
      state.view = 'LIST';
    },
    successHandler(info: { connection?: Directory; operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'COPY' }) {
      const { connection, operation } = info;

      if (typeof props.successCallback === 'function') {
        props.successCallback({
          operation,
          connection,
        });
      }
      if (operation !== 'COPY') {
        state.switchToListView();
      }
    },
  });

  return (
    <div>
      <Show when={state.view === 'LIST'}>
        <div class={styles.listview}>
          <div class={styles.header}>
            <h5 class={styles.h5}>{props.title || 'Manage Dsync Connections'}</h5>
            <div class={styles.ctoa}>
              <Button
                name='New Directory'
                handleClick={state.switchToCreateView}
                classNames={props.classNames?.button?.ctoa}
              />
            </div>
          </div>
          <Spacer y={8} />
          <DirectoryList
            {...props.componentProps?.directoryList}
            urls={{ get: props.urls.get }}
            handleActionClick={state.switchToEditView}
            handleListFetchComplete={state.handleListFetchComplete}
            tenant={props.tenant}
            product={props.product}></DirectoryList>
        </div>
      </Show>
      <Show when={state.view === 'EDIT'}>
        <div class={styles.header}>
          <h5 class={styles.h5}>Edit Dsync Connection</h5>
        </div>
        <EditDirectory
          {...props.componentProps?.editDirectory}
          classNames={props.classNames}
          successCallback={state.successHandler}
          errorCallback={props.errorCallback}
          cancelCallback={state.switchToListView}
          displayHeader={false}
          urls={{
            patch: `${props.urls.patch}/${state.directoryToEdit.id}`,
            delete: `${props.urls.delete}/${state.directoryToEdit.id}`,
            get: state.directoryFetchURL,
          }}
        />
      </Show>
      <Show when={state.view === 'CREATE'}>
        <div class={styles.header}>
          <h5 class={styles.h5}>Create Dsync Connection</h5>
        </div>
        <Spacer y={5} />
        <CreateDirectory
          {...props.componentProps?.createDirectory}
          classNames={props.classNames}
          successCallback={state.successHandler}
          errorCallback={props.errorCallback}
          cancelCallback={state.switchToListView}
          displayHeader={false}
          urls={{
            post: props.urls.post,
          }}
          tenant={props.tenant}
          product={props.product}
        />
      </Show>
    </div>
  );
}
