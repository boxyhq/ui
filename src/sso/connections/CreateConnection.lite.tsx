import { useStore, Show } from '@builder.io/mitosis';
import { LinkBack } from '@components/LinkBack';
import { InputWithCopyButton } from '@components/ClipboardButton';
import CreateOIDCConnection from './CreateOIDCConnection.lite';
import CreateSAMLConnection from './CreateSAMLConnection.lite';

export default function CreateConnection({
  setupLinkToken,
  idpEntityID,
  t,
  backUrl,
}: {
  setupLinkToken?: string;
  idpEntityID?: string;
  t: any;
  backUrl: string;
}) {
  const state = useStore({
    loading: false,
    newConnectionType: 'saml',
    get connectionIsSAML(): boolean {
      return state.newConnectionType === 'saml';
    },
    get connectionIsOIDC(): boolean {
      return state.newConnectionType === 'oidc';
    },
    handleNewConnectionTypeChange(event: any) {
      state.newConnectionType = event.target.value;
    },
  });

  return (
    <>
      <LinkBack href={backUrl} />
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
          <Show when={state.connectionIsSAML}>
            <CreateSAMLConnection></CreateSAMLConnection>
          </Show>
          <Show when={state.connectionIsOIDC}>
            <CreateOIDCConnection></CreateOIDCConnection>
          </Show>
        </form>
      </div>
    </>
  );
}
