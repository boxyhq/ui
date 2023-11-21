import { useStore, Show } from '@builder.io/mitosis';
import type { Directory, DirectoriesWrapperProps } from '../types';
import CreateDirectory from '../CreateDirectory/index.lite';
import Spacer from '../../shared/Spacer/index.lite';
import EditDirectory from '../EditDirectory/index.lite';
import DirectoryList from '../DirectoryList/index.lite';
import Card from '../../shared/Card/index.lite';
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
    get queryString(): string {
      if (props.urls.parameters.in === 'query') {
        return `?${props.urls.parameters.name}=${state.directoryToEdit.id}`;
      } else if (props.urls.parameters.in === 'path') {
        return `/${state.directoryToEdit.id}`;
      }
      return '';
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
      <div class={styles.listview}>
        <Show when={state.view === 'LIST'}>
          <Show when={state.directoriesAdded}>
            <Card
              title={state.dsyncEnabled ? 'Directory Sync enabled' : 'Directory Sync disabled'}
              variant={state.dsyncEnabled ? 'success' : 'info'}>
              <div class={styles.ctoa}>
                <Button
                  name='Add Connection'
                  handleClick={state.switchToCreateView}
                  classNames={props.classNames?.button?.ctoa}
                />
              </div>
            </Card>
            <Spacer y={4} />
          </Show>
          <DirectoryList
            {...props.componentProps?.directoryList}
            urls={{ get: props.urls.get }}
            handleActionClick={state.switchToEditView}
            handleListFetchComplete={state.handleListFetchComplete}>
            <Card variant='info' title='Directories not enabled'>
              <div class={styles.ctoa}>
                <Button
                  name='Add Connection'
                  handleClick={state.switchToCreateView}
                  classNames={props.classNames?.button?.ctoa}
                />
              </div>
            </Card>
          </DirectoryList>
        </Show>
      </div>
      <Show when={state.view === 'EDIT'}>
        <EditDirectory
          {...props.componentProps?.editDirectory}
          classNames={props.classNames}
          successCallback={state.successHandler}
          errorCallback={props.errorCallback}
          cancelCallback={state.switchToListView}
          urls={{
            patch: `${props.urls.patch}${state.queryString}`,
            delete: `${props.urls.delete}${state.queryString}`,
            get: `${props.urls.get}${state.queryString}`,
          }}
        />
      </Show>
      <Show when={state.view === 'CREATE'}>
        <Spacer y={5} />
        <CreateDirectory
          {...props.componentProps?.createDirectory}
          classNames={props.classNames}
          successCallback={state.successHandler}
          errorCallback={props.errorCallback}
          cancelCallback={state.switchToListView}
          urls={{
            post: props.urls.post,
          }}
        />
      </Show>
    </div>
  );
}
