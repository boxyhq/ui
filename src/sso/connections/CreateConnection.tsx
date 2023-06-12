import { useStore, onMount, onUpdate, Show, For } from '@builder.io/mitosis';
import {
  saveConnection,
  fieldCatalogFilterByConnection,
  renderFieldList,
  useFieldCatalog,
  excludeFallback,
  type AdminPortalSSODefaults,
  type FormObj,
  type FieldCatalogItem,
} from './utils.lite';
import { ApiResponse } from 'types';
import { errorToast } from '@components/Toaster';
import { LinkBack } from '@components/LinkBack';
import { ButtonPrimary } from '@components/ButtonPrimary';
import { InputWithCopyButton } from '@components/ClipboardButton';

function getInitialState(connectionType, fieldCatalog: FieldCatalogItem[]) {
  const _state = {};

  fieldCatalog.forEach(({ key, type, members, fallback, attributes: { connection } }) => {
    let value;
    if (connection && connection !== connectionType) {
      return;
    }
    /** By default those fields which do not have a fallback.activateCondition  will be excluded */
    if (typeof fallback === 'object' && typeof fallback.activateCondition !== 'function') {
      return;
    }
    if (type === 'object') {
      value = getInitialState(connectionType, members as FieldCatalogItem[]);
    }
    _state[key] = value ? value : '';
  });
  return _state;
}

export default function CreateConnection({
  setupLinkToken,
  idpEntityID,
  isSettingsView = false,
  t,
  adminPortalSSODefaults,
}: {
  setupLinkToken?: string;
  idpEntityID?: string;
  isSettingsView?: boolean;
  t: any;
  adminPortalSSODefaults?: AdminPortalSSODefaults;
}) {
  const state = useStore({
    loading: false,
    // STATE: New connection type
    newConnectionType: 'saml',
    get fieldCatalog() {
      return useFieldCatalog({ isSettingsView });
    },
    get connectionIsSAML(): boolean {
      return state.newConnectionType === 'saml';
    },
    get connectionIsOIDC(): boolean {
      return state.newConnectionType === 'oidc';
    },
    get backUrl() {
      return setupLinkToken
        ? `/setup/${setupLinkToken}`
        : isSettingsView
        ? '/admin/settings/sso-connection'
        : '/admin/sso-connection';
    },
    get redirectUrl() {
      return setupLinkToken
        ? `/setup/${setupLinkToken}/sso-connection`
        : isSettingsView
        ? '/admin/settings/sso-connection'
        : '/admin/sso-connection';
    },
    get mutationUrl() {
      return setupLinkToken
        ? `/api/setup/${setupLinkToken}/sso-connection`
        : isSettingsView
        ? '/api/admin/connections?isSystemSSO'
        : '/api/admin/connections';
    },
    // STATE: FORM
    formObj(): FormObj {
      return isSettingsView
        ? { ...getInitialState(state.newConnectionType, state.fieldCatalog), ...adminPortalSSODefaults }
        : { ...getInitialState(state.newConnectionType, state.fieldCatalog) };
    },
    handleNewConnectionTypeChange(event) {
      state.newConnectionType = event.target.value;
    },
    // HANDLER: Track fallback display
    activateFallback(key, fallbackKey) {
      state.formObj = (cur?: FormObj) => {
        const temp = { ...cur };
        delete temp[key];
        const fallbackItem = state.fieldCatalog.find(({ key }) => key === fallbackKey);
        const fallbackItemVal = fallbackItem?.type === 'object' ? {} : '';
        return { ...temp, [fallbackKey]: fallbackItemVal };
      };
    },
  });

  // Resync form state on save
  onMount(() => {
    const _state = getInitialState(state.newConnectionType, state.fieldCatalog);
    state.formObj = () => (isSettingsView ? { ..._state, ...adminPortalSSODefaults } : _state);
  });

  // Resync form state on save
  onUpdate(() => {
    const _state = getInitialState(state.newConnectionType, state.fieldCatalog);
    state.formObj = () => (isSettingsView ? { ..._state, ...adminPortalSSODefaults } : _state);
  }, [state.newConnectionType, state.fieldCatalog, isSettingsView, adminPortalSSODefaults]);

  return (
    <>
      <LinkBack href={state.backUrl} />
      <Show when={idpEntityID && setupLinkToken}>
        <div className='mb-5 mt-5 items-center justify-between'>
          <div className='form-control'>
            <InputWithCopyButton text={idpEntityID} label={t('idp_entity_id')} />
          </div>
        </div>
      </Show>
      <div>
        <h2 className='mb-5 mt-5 font-bold text-gray-700 dark:text-white md:text-xl'>
          {t('create_sso_connection')}
        </h2>
        <div className='mb-4 flex items-center'>
          <div className='mr-2 py-3'>{t('select_sso_type')}:</div>
          <div className='flex w-52'>
            <div className='form-control'>
              <label className='label mr-4 cursor-pointer'>
                <input
                  type='radio'
                  name='connection'
                  value='saml'
                  className='radio-primary radio'
                  checked={state.newConnectionType === 'saml'}
                  onChange={state.handleNewConnectionTypeChange}
                />
                <span className='label-text ml-1'>{t('saml')}</span>
              </label>
            </div>
            <div className='form-control'>
              <label className='label mr-4 cursor-pointer' data-testid='sso-type-oidc'>
                <input
                  type='radio'
                  name='connection'
                  value='oidc'
                  className='radio-primary radio'
                  checked={state.newConnectionType === 'oidc'}
                  onChange={state.handleNewConnectionTypeChange}
                />
                <span className='label-text ml-1'>{t('oidc')}</span>
              </label>
            </div>
          </div>
        </div>
        <form>
          <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
            <div className='flex'>
              <ButtonPrimary loading={state.loading} data-testid='submit-form-create-sso'>
                {t('save_changes')}
              </ButtonPrimary>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
