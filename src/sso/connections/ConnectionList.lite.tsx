import LinkIcon from '../../shared/LinkIcon.lite';
import PlusIcon from '../../shared/PlusIcon.lite';
import { LinkPrimary } from '@components/LinkPrimary';
import { InputWithCopyButton } from '@components/ClipboardButton';
import type { OIDCSSORecord, SAMLSSORecord } from '@boxyhq/saml-jackson';
import { useStore, Show } from '@builder.io/mitosis';

const DEFAULT_VALUES = {
  isSettingsView: false,
};

export default function ConnectionList({
  setupLinkToken,
  createConnectionUrl,
  idpEntityID,
  isSettingsView,
  translation,
  router,
}: {
  setupLinkToken?: string;
  createConnectionUrl: string;
  idpEntityID?: string;
  isSettingsView?: boolean;
  translation: any;
  router: any;
}) {
  const state = useStore({
    displayTenantProduct: setupLinkToken ? false : true,
    // Translation is already being passed as prop
    paginate: { offset: this.offset },
    // store that maps the pageToken for the next page with the current offset
    pageTokenMap: {},
    get offset() {
      return router.query.offset ? Number(router.query.offset) : 0;
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
    usePaginate: (router: any) => {},
  });

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-gray-700 dark:text-white md:text-xl'>
          {translation(isSettingsView ? 'admin_portal_sso' : 'enterprise_sso')}
        </h2>
        <div className='flex gap-2'>
          <LinkPrimary Icon={PlusIcon} href={createConnectionUrl} data-testid='create-connection'>
            {translation('new_connection')}
          </LinkPrimary>
          <Show when={!setupLinkToken && !isSettingsView}>
            <LinkPrimary
              Icon={LinkIcon}
              href='/admin/sso-connection/setup-link/new'
              data-testid='create-setup-link'>
              {translation('new_setup_link')}
            </LinkPrimary>
          </Show>
        </div>
      </div>
      <Show when={idpEntityID && setupLinkToken}>
        <div className='mb-5 mt-5 items-center justify-between'>
          <div className='form-control'>
            <InputWithCopyButton text={idpEntityID} label={translation('idp_entity_id')} />
          </div>
        </div>
      </Show>
    </div>
  );
}
