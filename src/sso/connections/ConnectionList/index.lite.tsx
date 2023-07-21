import { useStore, Show, Slot, onMount, For } from '@builder.io/mitosis';
import { ConnectionListProps, OIDCSSORecord, SAMLSSORecord } from '../types';
import Loading from '../../../shared/Loading/index.lite';
import InputWithCopyButton from '../../../shared/InputWithCopyButton/index.lite';
import EmptyState from '../../../shared/EmptyState/index.lite';
import Badge from '../../../shared/Badge/index.lite';
import IconButton from '../../../shared/IconButton/index.lite';
import cssClassAssembler from '../../utils/cssClassAssembler';
import defaultClasses from './index.module.css';
import PencilIcon from '../../../shared/icons/PencilIcon.lite';

const DEFAULT_VALUES = {
  isSettingsView: false,
  connectionListData: [] as ((SAMLSSORecord | OIDCSSORecord) & { isSystemSSO?: boolean })[],
};

export default function ConnectionList(props: ConnectionListProps) {
  const state = useStore({
    get displayTenantProduct() {
      return props.setupLinkToken ? false : true;
    },
    connectionListData: DEFAULT_VALUES.connectionListData,
    connectionListError: '',
    connectionListIsLoading: false,
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        linkPrimaryContainer: cssClassAssembler(
          props.classNames?.linkPrimaryContainer,
          defaultClasses.linkPrimaryContainer
        ),
        idpEntityContainer: cssClassAssembler(
          props.classNames?.idpEntityContainer,
          defaultClasses.idpEntityContainer
        ),
        formControl: cssClassAssembler(props.classNames?.formControl, defaultClasses.formControl),
        h2: cssClassAssembler(props.classNames?.h2, defaultClasses.h2),
        tableContainer: cssClassAssembler(props.classNames?.tableContainer, defaultClasses.tableContainer),
        table: cssClassAssembler(props.classNames?.table, defaultClasses.table),
        tableHead: cssClassAssembler(props.classNames?.tableHead, defaultClasses.tableHead),
        tableRow: cssClassAssembler(props.classNames?.tableRow, defaultClasses.tableRow),
        tableHeadScope: cssClassAssembler(props.classNames?.tableHeadScope, defaultClasses.tableHeadScope),
        connectionListContainer: cssClassAssembler(
          props.classNames?.connectionListContainer,
          defaultClasses.connectionListContainer
        ),
        connectionListTableData: cssClassAssembler(
          props.classNames?.connectionListTableData,
          defaultClasses.connectionListTableData
        ),
        connectionTenantData: cssClassAssembler(
          props.classNames?.connectionTenantData,
          defaultClasses.connectionTenantData
        ),
        badgeClass: cssClassAssembler(props.classNames?.badgeClass, defaultClasses.badgeClass),
        tableData: cssClassAssembler(props.classNames?.tableData, defaultClasses.tableData),
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

  onMount(() => {
    async function getFieldsData() {
      state.connectionListIsLoading = true;
      const response = await fetch(props.getConnectionsUrl);
      const { data, error } = await response.json();
      state.connectionListData = data;

      if (error) {
        state.connectionListError = error;
      }

      state.connectionListIsLoading = false;
    }
    getFieldsData();
  });

  return (
    <div>
      <Show when={state.connectionListIsLoading}>
        <Loading />
      </Show>
      <Show when={state.connectionListError}>
        <Slot name={props.slotErrorToast}></Slot>
      </Show>
      <Show when={state.connectionListData?.length > 0}>
        <div class={state.classes.container}>
          <h2 class={state.classes.h2}>
            {props.translation(
              props.isSettingsView || DEFAULT_VALUES.isSettingsView ? 'admin_portal_sso' : 'enterprise_sso'
            )}
          </h2>
          <div class={state.classes.linkPrimaryContainer}>
            <Slot name={props.slotLinkPrimary}></Slot>
            <Show when={!props.setupLinkToken && !(props.isSettingsView || DEFAULT_VALUES.isSettingsView)}>
              <Slot name={props.slotLinkPrimary}></Slot>
            </Show>
          </div>
        </div>
        <Show when={props.idpEntityID && props.setupLinkToken}>
          <div class={state.classes.idpEntityContainer}>
            <div class={state.classes.formControl}>
              <InputWithCopyButton
                text={props.idpEntityID || ''}
                label={props.translation('idp_entity_id')}
                toastSuccessCallback={props.successCallback}
              />
            </div>
          </div>
        </Show>
        <Show
          when={state.connectionListData}
          else={
            <EmptyState title={props.translation('no_connections_found')} href={props.createConnectionsUrl} />
          }>
          <div class={state.classes.tableContainer}>
            <table class={state.classes.table}>
              <thead class={state.classes.tableHead}>
                <tr class={state.classes.tableRow}>
                  <th scope='col' class={state.classes.tableHeadScope}>
                    {props.translation('name')}
                  </th>
                  <Show when={state.displayTenantProduct}>
                    <th scope='col' class={state.classes.tableHeadScope}>
                      {props.translation('tenant')}
                    </th>
                    <th scope='col' class={state.classes.tableHeadScope}>
                      {props.translation('product')}
                    </th>
                  </Show>
                  <th scope='col' class={state.classes.tableHeadScope}>
                    {props.translation('idp_type')}
                  </th>
                  <th scope='col' class={state.classes.tableHeadScope}>
                    {props.translation('status')}
                  </th>
                  <th scope='col' class={state.classes.tableHeadScope}>
                    {props.translation('actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <For each={state.connectionListData}>
                  {(connection, index) => (
                    <tr key={index} class={state.classes.connectionListContainer}>
                      <td class={state.classes.connectionListTableData}>
                        {state.connectionDisplayName(connection)}
                        <Show when={connection.isSystemSSO}>
                          <Badge
                            color='info'
                            ariaLabel='is an sso connection for the admin portal'
                            size='xs'
                            className={state.classes.badgeClass}>
                            {props.translation('system')}
                          </Badge>
                        </Show>
                      </td>
                      <Show when={state.displayTenantProduct}>
                        <td class={state.classes.connectionTenantData}>{connection.tenant}</td>
                        <td class={state.classes.connectionListTableData}>{connection.product}</td>
                      </Show>
                      <td class={state.classes.tableHeadScope}>
                        <Show when={'oidcProvider' in connection}>OIDC</Show>
                        <Show when={'idpMetadata' in connection}>SAML</Show>
                      </td>
                      <td class={state.classes.tableData}>
                        <Show
                          when={connection.deactivated}
                          else={
                            <Badge color='black' size='md'>
                              {props.translation('active')}
                            </Badge>
                          }>
                          <Badge color='red' size='md'>
                            {props.translation('inactive')}
                          </Badge>
                        </Show>
                      </td>
                      <td class={state.classes.tableHeadScope}>
                        <span class={state.classes.spanIcon}>
                          <IconButton
                            Icon={PencilIcon}
                            iconClasses={state.classes.icon}
                            data-testid='edit'
                            onClick={() => {
                              props.onIconClick();
                            }}
                          />
                        </span>
                      </td>
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
