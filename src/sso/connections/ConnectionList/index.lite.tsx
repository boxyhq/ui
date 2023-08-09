import { useStore, Show, For, onUpdate } from '@builder.io/mitosis';
import type { ConnectionData, ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import Loading from '../../../shared/Loading/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import Badge from '../../../shared/Badge/index.lite';
import IconButton from '../../../shared/IconButton/index.lite';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import PencilIcon from '../../../shared/icons/PencilIcon.lite';

const DEFAULT_VALUES = {
  isSettingsView: false,
  connectionListData: [] as ConnectionData<any>[],
};

export default function ConnectionList(props: ConnectionListProps) {
  const state = useStore({
    connectionListData: DEFAULT_VALUES.connectionListData,
    connectionListError: '',
    connectionListIsLoading: true,
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        formControl: cssClassAssembler(props.classNames?.formControl, defaultClasses.formControl),
        tableContainer: cssClassAssembler(props.classNames?.tableContainer, defaultClasses.tableContainer),
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        tableCaption: cssClassAssembler(props.classNames?.tableCaption, defaultClasses.tableCaption),
        thead: cssClassAssembler(props.classNames?.thead, defaultClasses.thead),
        tr: cssClassAssembler(props.classNames?.tr, defaultClasses.tr),
        th: cssClassAssembler(props.classNames?.th, defaultClasses.th),
        connectionListContainer: cssClassAssembler(
          props.classNames?.connectionListContainer,
          defaultClasses.connectionListContainer
        ),
        td: cssClassAssembler(props.classNames?.td, defaultClasses.td),
        badgeClass: cssClassAssembler(props.classNames?.badgeClass, defaultClasses.badgeClass),
        spanIcon: cssClassAssembler(props.classNames?.spanIcon, defaultClasses.spanIcon),
        icon: cssClassAssembler(props.classNames?.icon, defaultClasses.icon),
      };
    },
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

  async function getFieldsData(url: string) {
    const response = await fetch(url);
    const { data, error } = await response.json();
    state.connectionListIsLoading = false;
    if (error) {
      state.connectionListError = error;
    } else {
      state.connectionListData = data;
      typeof props.onListFetchComplete === 'function' && props.onListFetchComplete(data);
    }
  }

  onUpdate(() => {
    getFieldsData(props.getConnectionsUrl);
  }, [props.getConnectionsUrl]);

  return (
    <Show
      when={state.connectionListIsLoading}
      else={
        <div>
          <Show
            when={state.connectionListData?.length > 0}
            else={<EmptyState title='No connections found.' />}>
            <div class={state.classes.tableContainer}>
              <table class={state.classes.table}>
                <Show when={props.tableCaption}>
                  <caption class={state.classes.tableCaption}>{props.tableCaption}</caption>
                </Show>
                <thead class={state.classes.thead}>
                  <tr class={state.classes.tr}>
                    <Show when={!props.hideCols?.includes('provider')}>
                      <th scope='col' class={state.classes.th}>
                        provider
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('tenant')}>
                      <th scope='col' class={state.classes.th}>
                        tenant
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('product')}>
                      <th scope='col' class={state.classes.th}>
                        product
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('idp_type')}>
                      <th scope='col' class={state.classes.th}>
                        idp type
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('status')}>
                      <th scope='col' class={state.classes.th}>
                        status
                      </th>
                    </Show>
                    <Show when={!props.hideCols?.includes('actions')}>
                      <th scope='col' class={state.classes.th}>
                        actions
                      </th>
                    </Show>
                  </tr>
                </thead>
                <tbody>
                  <For each={state.connectionListData}>
                    {(connection, index) => (
                      <tr key={index} class={state.classes.connectionListContainer}>
                        <Show when={!props.hideCols?.includes('provider')}>
                          <td class={state.classes.td}>
                            {state.connectionDisplayName(connection)}
                            <Show when={connection.isSystemSSO}>
                              <Badge
                                color='info'
                                ariaLabel='is an sso connection for the admin portal'
                                size='xs'
                                className={state.classes.badgeClass}>
                                system
                              </Badge>
                            </Show>
                          </td>
                        </Show>
                        <Show when={!props.hideCols?.includes('tenant')}>
                          <td class={state.classes.td}>{connection.tenant}</td>
                        </Show>
                        <Show when={!props.hideCols?.includes('product')}>
                          <td class={state.classes.td}>{connection.product}</td>
                        </Show>
                        <Show when={!props.hideCols?.includes('idp_type')}>
                          <td class={state.classes.td}>
                            <Show when={'oidcProvider' in connection}>OIDC</Show>
                            <Show when={'idpMetadata' in connection}>SAML</Show>
                          </td>
                        </Show>
                        <Show when={!props.hideCols?.includes('status')}>
                          <td class={state.classes.td}>
                            <Show
                              when={connection.deactivated}
                              else={
                                <Badge color='black' size='md'>
                                  Active
                                </Badge>
                              }>
                              <Badge color='red' size='md'>
                                Inactive
                              </Badge>
                            </Show>
                          </td>
                        </Show>
                        <Show when={!props.hideCols?.includes('actions')}>
                          <td class={state.classes.td}>
                            <span class={state.classes.spanIcon}>
                              {/* TODO: Accept dynamic action here */}
                              <IconButton
                                Icon={PencilIcon}
                                iconClasses={state.classes.icon}
                                data-testid='edit'
                                onClick={(event) => props.onActionClick(connection)}
                              />
                            </span>
                          </td>
                        </Show>
                      </tr>
                    )}
                  </For>
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
