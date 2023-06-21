import LinkIcon from '@heroicons/react/24/outline/LinkIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import EmptyState from '@components/EmptyState';
import { LinkPrimary } from '@components/LinkPrimary';
import { IconButton } from '@components/IconButton';
import { InputWithCopyButton } from '@components/ClipboardButton';
import { Pagination, pageLimit, NoMoreResults } from '@components/Pagination';
import usePaginate from '@lib/ui/hooks/usePaginate';
import type { OIDCSSORecord, SAMLSSORecord } from '@boxyhq/saml-jackson';
import { fetcher } from '@lib/ui/utils';
import Loading from '@components/Loading';
import { errorToast } from '@components/Toaster';
import type { ApiError, ApiSuccess } from 'types';
import Badge from '@components/Badge';
import { useStore, Show } from '@builder.io/mitosis';

const DEFAULT_VALUES = {
  isSettingsView: false,
};

export default function ConnectionList({
  setupLinkToken,
  idpEntityID,
  isSettingsView,
  translation,
}: {
  setupLinkToken?: string;
  idpEntityID?: string;
  isSettingsView?: boolean;
  translation: any;
}) {
  const state = useStore({
    displayTenantProduct: setupLinkToken ? false : true,
    get getConnectionsUrl() {
      return setupLinkToken
        ? `/api/setup/${setupLinkToken}/sso-connection`
        : isSettingsView
        ? `/api/admin/connections?isSystemSSO`
        : `/api/admin/connections?pageOffset=${paginate.offset}&pageLimit=${pageLimit}`;
    },
    get createConnectionUrl() {
      return setupLinkToken
        ? `/setup/${setupLinkToken}/sso-connection/new`
        : isSettingsView
        ? `/admin/settings/sso-connection/new`
        : '/admin/sso-connection/new';
    },
    get t() {
      return translation;
    },
    connectionDisplayName: (connection: SAMLSSORecord | OIDCSSORecord) => {
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

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-gray-700 dark:text-white md:text-xl'>
          {state.t(isSettingsView ? 'admin_portal_sso' : 'enterprise_sso')}
        </h2>
        <div className='flex gap-2'>
          <LinkPrimary Icon={PlusIcon} href={state.createConnectionUrl} data-testid='create-connection'>
            {state.t('new_connection')}
          </LinkPrimary>
          <Show when={!setupLinkToken && !isSettingsView}>
            <LinkPrimary
              Icon={LinkIcon}
              href='/admin/sso-connection/setup-link/new'
              data-testid='create-setup-link'>
              {state.t('new_setup_link')}
            </LinkPrimary>
          </Show>
        </div>
      </div>
      <Show when={idpEntityID && setupLinkToken}>
        <div className='mb-5 mt-5 items-center justify-between'>
          <div className='form-control'>
            <InputWithCopyButton text={idpEntityID} label={state.t('idp_entity_id')} />
          </div>
        </div>
      </Show>
    </div>
  );
}
