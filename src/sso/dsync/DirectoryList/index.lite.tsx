import { useStore, Show, For, onUpdate } from '@builder.io/mitosis';
import type { Directory } from '../types';
import LoadingContainer from '../../../shared/LoadingContainer/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import type { DirectoryListProps } from '../types';
import Badge from '../../../shared/Badge/index.lite';
import IconButton from '../../../shared/IconButton/index.lite';
import PencilIcon from '../../../shared/icons/PencilIcon.lite';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import Table from '../../../shared/Table/index.lite';

const DEFAULT_VALUES = {
  directoryListData: [] as Directory[],
  providers: null,
};

export default function DirectoryList(props: DirectoryListProps) {
  const state = useStore({
    directoryListData: DEFAULT_VALUES.directoryListData,
    providers: DEFAULT_VALUES.providers,
    isDirectoryListLoading: true,
    directoryListError: '',
    directoryListIsLoading: true,
    get displayTenantProduct() {
      return props.setupLinkToken ? false : true;
    },
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        tableHead: cssClassAssembler(props.classNames?.tableHead, defaultClasses.tableHead),
        tableData: cssClassAssembler(props.classNames?.tableData, defaultClasses.tableData),
      };
    },
  });

  onUpdate(() => {
    async function getFieldsData(directoryListUrl: string, directoryProvider: string) {
      // fetch request for obtaining directory lists data
      const directoryListResponse = await fetch(directoryListUrl);
      const { data: listData, error } = await directoryListResponse.json();

      // fetch request for obtaining directory providers data
      const directoryProvidersResponse = await fetch(directoryProvider);
      const { data: providersData } = await directoryProvidersResponse.json();

      state.isDirectoryListLoading = false;

      state.directoryListData = listData;
      state.providers = providersData;

      if (error) {
        state.directoryListError = error;
      }
      state.directoryListIsLoading = false;
    }

    getFieldsData(props.urls.getDirectoriesUrl, props.urls.useDirectoryProviderUrl);
  }, [props.urls.getDirectoriesUrl]);

  return (
    <Show
      when={state.directoryListIsLoading}
      else={
        <div>
          <Show
            when={state.directoryListData?.length > 0}
            else={<EmptyState title='No directories found.' />}>
            <div class={state.classes.container}>
              <table class={state.classes.table}>
                <Show when={props.tableCaption}>
                  <caption class={defaultClasses.caption}>{props.tableCaption}</caption>
                </Show>
                <thead class={defaultClasses.tableHeadContainer}>
                  <tr>
                    <Show when={!props.hideCols?.includes('name')}>
                      <th scope='col' class={state.classes.tableHead}>
                        name
                      </th>
                    </Show>
                    <Show when={state.displayTenantProduct}>
                      <>
                        <Show when={!props.hideCols?.includes('tenant')}>
                          <th scope='col' class={state.classes.tableHead}>
                            tenant
                          </th>
                        </Show>
                        <Show when={!props.hideCols?.includes('product')}>
                          <th scope='col' class={state.classes.tableHead}>
                            product
                          </th>
                        </Show>
                      </>
                    </Show>
                    <Show when={!props.hideCols?.includes('type')}>
                      <th scope='col' class={state.classes.tableHead}>
                        type
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('status')}>
                      <th scope='col' class={state.classes.tableHead}>
                        status
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('actions')}>
                      <th scope='col' class={state.classes.tableHead}>
                        actions
                      </th>
                    </Show>
                  </tr>
                </thead>
                <tbody>
                  <Show when={state.directoryListData}>
                    <For each={state.directoryListData}>
                      {(directory) => (
                        <tr key={directory.id} class={defaultClasses.tableRow}>
                          <Show when={!props.hideCols?.includes('name')}>
                            <td class={defaultClasses.tableDataItem}>{directory.name}</td>
                          </Show>
                          <Show when={state.displayTenantProduct}>
                            <>
                              <Show when={!props.hideCols?.includes('tenant')}>
                                <td class={state.classes.tableData}>{directory.tenant}</td>
                              </Show>
                              <Show when={!props.hideCols?.includes('product')}>
                                <td class={state.classes.tableData}>{directory.product}</td>
                              </Show>
                            </>
                          </Show>
                          <Show when={state.providers}>
                            <Show when={!props.hideCols?.includes('type')}>
                              <td class={state.classes.tableData}>{state.providers?.[directory.type]}</td>
                            </Show>
                          </Show>
                          <Show when={!props.hideCols?.includes('status')}>
                            <td class={state.classes.tableData}>
                              <Show
                                when={directory.deactivated}
                                else={
                                  <Badge color='black' size='sm'>
                                    Active
                                  </Badge>
                                }>
                                <Badge color='red' size='sm'>
                                  Inactive
                                </Badge>
                              </Show>
                            </td>
                          </Show>
                          <Show when={!props.hideCols?.includes('actions')}>
                            <td class={state.classes.tableData}>
                              <span class={defaultClasses.span}>
                                <IconButton
                                  Icon={PencilIcon}
                                  iconClasses=''
                                  data-testid='edit'
                                  onClick={() => props.onActionClick()}></IconButton>
                              </span>
                            </td>
                          </Show>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>
          </Show>
          <Table cols={props.cols} />
        </div>
      }>
      <LoadingContainer isBusy={state.isDirectoryListLoading} />
    </Show>
  );
}
