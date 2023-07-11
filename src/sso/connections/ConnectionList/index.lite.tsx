import { useStore, Show, Slot, onMount, For } from '@builder.io/mitosis';
import { ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import Loading from '../../../shared/Loading/index.lite';
import InputWithCopyButton from '../../../shared/InputWithCopyButton/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import Badge from '../../../shared/Badge/index.lite';

const DEFAULT_VALUES = {
  isSettingsView: false,
};

export default function ConnectionList(props: ConnectionListProps) {
  const state = useStore({
    get displayTenantProduct() {
      return props.setupLinkToken ? false : true;
    },
    get createConnectionUrl() {
      return props.setupLinkToken
        ? `/setup/${props.setupLinkToken}/sso-connection/new`
        : props.isSettingsView
        ? `/admin/settings/sso-connection/new`
        : '/admin/sso-connection/new';
    },
    connectionListData: [],
    connectionListError: '',
    connectionListIsLoading: false,
    connectionDisplayName(connection: SAMLSSORecord | OIDCSSORecord) {
      if (connection.name) {
        return connection.name;
      }

      if ('idpMetadata' in connection) {
        return connection.idpMetadata.friendlyProviderName || connection.idpMetadata.provider;
      }

      if ('oidcProvider' in connection) {
        return connection.oidcProvider.provider;
      }

      return 'Unknown';
    },
  });

  onMount(() => {
    function getFieldsData(event: any) {
      void (async function () {
        const response = await fetch(props.connectionsUrl);
        const { data, error, isLoading } = await response.json();

        state.connectionListData = data;
        state.connectionListError = error;

        if (error) {
          state.connectionListError = error;
        }

        if (isLoading) {
          state.connectionListIsLoading = true;
        }
      })();
    }
  });

  return (
    <div>
      <Show when={state.connectionListIsLoading}>
        <Loading />
      </Show>
      <Show when={state.connectionListError}>
        <Slot name={props.slotErrorToast}></Slot>
      </Show>
      <Show when={state.connectionListData.length > 0}>
        <div class='mb-5 flex items-center justify-between'>
          <h2 class='font-bold text-gray-700 dark:text-white md:text-xl'>
            {props.translation(
              props.isSettingsView || DEFAULT_VALUES.isSettingsView ? 'admin_portal_sso' : 'enterprise_sso'
            )}
          </h2>
          <div class='flex gap-2'>
            <Slot name={props.slotLinkPrimary}></Slot>
            <Show when={!props.setupLinkToken && !(props.isSettingsView || DEFAULT_VALUES.isSettingsView)}>
              <Slot name={props.slotLinkPrimary}></Slot>
            </Show>
          </div>
        </div>
        <Show when={props.idpEntityID && props.setupLinkToken}>
          <div class='mb-5 mt-5 items-center justify-between'>
            <div class='form-control'>
              <InputWithCopyButton
                text={props.idpEntityID || ''}
                label={props.translation('idp_entity_id')}
                translation={props.translation}
                toastSuccessCallback={props.toastSuccessCallback}
              />
            </div>
          </div>
        </Show>
        <Show
          when={state.connectionListData}
          else={
            <EmptyState title={props.translation('no_connections_found')} href={state.createConnectionUrl} />
          }>
          <div class='rounder border'>
            <table class='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead class='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr class='hover:bg-gray-50'>
                  <th scope='col' class='px-6 py-3'>
                    {props.translation('name')}
                  </th>
                  <Show when={state.displayTenantProduct}>
                    <div>
                      <th scope='col' class='px-6 py-3'>
                        {props.translation('tenant')}
                      </th>
                      <th scope='col' class='px-6 py-3'>
                        {props.translation('product')}
                      </th>
                    </div>
                  </Show>
                  <th scope='col' class='px-6 py-3'>
                    {props.translation('idp_type')}
                  </th>
                  <th scope='col' class='px-6 py-3'>
                    {props.translation('status')}
                  </th>
                  <th scope='col' class='px-6 py-3'>
                    {props.translation('actions')}
                  </th>
                </tr>
                tab
              </thead>
              <tbody>
                <For each={state.connectionListData}>
                  {(connection: any, index: number) => (
                    <tr class='border-b bg-white last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'>
                      <td class='whitespace-nowrap px-6 py-3 text-sm text-gray-500 dark:text-gray-400'>
                        {state.connectionDisplayName(connection)}
                        <Show when={connection?.isSystemSSO}>
                          <Badge
                            color='info'
                            ariaLabel='is an sso connection for the admin portal'
                            size='xs'
                            className='ml-2 uppercase'>
                            {props.translation('system')}
                          </Badge>
                        </Show>
                      </td>
                      <Show when={state.displayTenantProduct}>
                        <div>
                          <td className='whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900 dark:text-white'>
                            {connection?.tenant}
                          </td>
                          <td className='whitespace-nowrap px-6 py-3 text-sm text-gray-500 dark:text-gray-400'>
                            {connection?.product}
                          </td>
                        </div>
                      </Show>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Show>
    </div>
  );
}
