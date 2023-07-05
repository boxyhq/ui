import { useStore, Show, Slot } from '@builder.io/mitosis';
import InputWithCopyButton from '../../shared/ClipboardButton.lite';
import CreateOIDCConnection from './CreateOIDCConnection.lite';
import CreateSAMLConnection from './CreateSAMLConnection.lite';
import { CreateConnectionParentProps } from './types';

export default function CreateConnection(props: CreateConnectionParentProps) {
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
    <div>
      <Slot name={props.slotLinkBack}></Slot>
      <Show when={props.idpEntityID && props.setupLinkToken}>
        <div className='mb-5 mt-5 items-center justify-between'>
          <div className='form-control'>
            <InputWithCopyButton
              text={props.idpEntityID}
              label={props.t('idp_entity_id')}
              translation={props.t}
              toastSucessCallback={props.errorSuccessCallback}
            />
          </div>
        </div>
      </Show>
      <div>
        <h2 className='mb-5 mt-5 font-bold text-gray-700 dark:text-white md:text-xl'>
          {props.t('create_sso_connection')}
        </h2>
        <div className='mb-4 flex items-center'>
          <div className='mr-2 py-3'>{props.t('select_sso_type')}:</div>
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
                <span className='label-text ml-1'>{props.t('saml')}</span>
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
                <span className='label-text ml-1'>{props.t('oidc')}</span>
              </label>
            </div>
          </div>
        </div>
        <Show when={state.connectionIsSAML}>
          <CreateSAMLConnection
            errorToastCallback={props.errorToastCallback}
            loading={state.loading}
            setupLinkToken={props.setupLinkToken}
            t={props.t}
            connectionIsOIDC={state.connectionIsOIDC}
            connectionIsSAML={state.connectionIsSAML}
            cb={props.cb}></CreateSAMLConnection>
        </Show>
        <Show when={state.connectionIsOIDC}>
          <CreateOIDCConnection
            errorToastCallback={props.errorToastCallback}
            loading={state.loading}
            setupLinkToken={props.setupLinkToken}
            t={props.t}
            connectionIsOIDC={state.connectionIsOIDC}
            connectionIsSAML={state.connectionIsSAML}
            cb={props.cb}></CreateOIDCConnection>
        </Show>
      </div>
    </div>
  );
}
