import { useStore, Show, onMount, For } from '@builder.io/mitosis';
import type { Directory, DirectorySyncProviders } from '../types';
import Loading from '../../../shared/Loading/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import type { DirectoryListProps } from '../types';
import Badge from '../../../shared/Badge/index.lite';
import IconButton from '../../../shared/IconButton/index.lite';
import PencilIcon from '../../../shared/icons/PencilIcon.lite';
import EyeIcon from '../../../shared/icons/EyeIcon.lite';

const DEFAULT_VALUES = {
  directoryListData: [] as Directory[],
  providers: null,
};

export default function DirectoryList(props: DirectoryListProps) {
  const state = useStore({
    directoryListData: DEFAULT_VALUES.directoryListData,
    providers: DEFAULT_VALUES.providers,
    directoryListError: '',
    directoryListIsLoading: true,
    get displayTenantProduct() {
      return props.setupLinkToken ? false : true;
    },
  });

  onMount(() => {
    async function getFieldsData(directoryListUrl: string, directoryProvider: string) {
      // fetch request for obtaining directory lists data
      const directoryListResponse = await fetch(directoryListUrl);
      const { data: listData, error } = await directoryListResponse.json();

      // fetch request for obtaining directory providers data
      const directoryProvidersResponse = await fetch(directoryProvider);
      const { data: providersData } = await directoryProvidersResponse.json();

      state.directoryListData = listData;
      state.providers = providersData;

      if (error) {
        state.directoryListError = error;
      }
      state.directoryListIsLoading = false;
    }

    getFieldsData(props.urls.getDirectoriesUrl, props.urls.useDirectoryProviderUrl);
  });

  return (
    <Show
      when={state.directoryListIsLoading}
      else={
        <div>
          <Show
            when={state.directoryListData?.length > 0}
            else={<EmptyState title='No directories found.' />}>
            <div class='rounded border'>
              <table class='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
                <Show when={props.tableCaption}>
                  <caption class='bg-white'>{props.tableCaption}</caption>
                </Show>
                <thead class='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                  <tr class='hover:bg-gray-50'>
                    <th scope='col' class='px-6 py-3'>
                      NAME
                    </th>
                    <Show when={state.displayTenantProduct}>
                      <>
                        <th scope='col' class='px-6 py-3'>
                          TENANT
                        </th>
                        <th scope='col' class='px-6 py-3'>
                          PRODUCT
                        </th>
                      </>
                    </Show>
                    <th scope='col' class='px-6 py-3'>
                      TYPE
                    </th>
                    <th scope='col' class='px-6 py-3'>
                      STATUS
                    </th>
                    <th scope='col' class='px-6 py-3'>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <Show when={state.directoryListData}>
                    <For each={state.directoryListData}>
                      {(directory) => (
                        <tr
                          key={directory.id}
                          class='border-b bg-white last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
                          <td class='whitespace-nowrap px-6 py-3 text-sm text-gray-500 dark:text-gray-400'>
                            {directory.name}
                          </td>
                          <Show when={state.displayTenantProduct}>
                            <>
                              <td class='px-6'>{directory.tenant}</td>
                              <td class='px-6'>{directory.product}</td>
                            </>
                          </Show>
                          <Show when={state.providers}>
                            <td class='px-6'>{state.providers?.[directory.type]}</td>
                          </Show>
                          <td class='px-6'>
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
                          <td class='px-6'>
                            <span class='inline-flex items-baseline'>
                              <IconButton
                                Icon={PencilIcon}
                                iconClasses=''
                                data-testid='edit'
                                onClick={() => props.onActionClick()}></IconButton>
                            </span>
                          </td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>
          </Show>
        </div>
      }>
      <Loading />
    </Show>
  );
}
