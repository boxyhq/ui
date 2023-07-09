import { useStore, Show, Slot } from '@builder.io/mitosis';
import CreateOIDCConnection from './oidc/index.lite';
import CreateSAMLConnection from './saml/index.lite';
import { CreateConnectionParentProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import { InputWithCopyButton } from '../../../shared/ClipboardButton/index.lite';

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
    get classes() {
      return {
        container: cssClassAssembler(props.classNames?.container, defaultClasses.container),
        containerWidth: cssClassAssembler(props.classNames?.containerWidth, defaultClasses.containerWidth),
        formControl: cssClassAssembler(props.classNames?.formControl, defaultClasses.formControl),
        selectSSO: cssClassAssembler(props.classNames?.selectSSO, defaultClasses.selectSSO),
        idpId: cssClassAssembler(props.classNames?.idpId, defaultClasses.idpId),
        radio: cssClassAssembler(props.classNames?.radio, defaultClasses.radio),
        span: cssClassAssembler(props.classNames?.span, defaultClasses.span),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
        h2: cssClassAssembler(props.classNames?.h2, defaultClasses.h2),
      };
    },
    handleNewConnectionTypeChange(event: any) {
      state.newConnectionType = event.target.value;
      console.log('Connection type changed');
      console.log(event.target.value);
    },
  });

  return (
    <div>
      <Slot name={props.slotLinkBack}></Slot>
      <Show when={props.idpEntityID && props.setupLinkToken}>
        <div className={state.classes.idpId}>
          <div className={state.classes.formControl}>
            <InputWithCopyButton
              text={props.idpEntityID || ''}
              label={props.t('idp_entity_id')}
              translation={props.t}
              toastSuccessCallback={props.successToastCallback}
            />
          </div>
        </div>
      </Show>
      <div>
        <h2 className={state.classes.h2}>{props.t('create_sso_connection')}</h2>
        <div className={state.classes.container}>
          <div className={state.classes.selectSSO}>{props.t('select_sso_type')}:</div>
          <div className={state.classes.containerWidth}>
            <div className={state.classes.formControl}>
              <label className={state.classes.label}>
                <input
                  type='radio'
                  name='connection'
                  value='saml'
                  className={state.classes.radio}
                  checked={state.newConnectionType === 'saml'}
                  onChange={(event) => state.handleNewConnectionTypeChange(event)}
                />
                <span className={state.classes.span}>{props.t('saml')}</span>
              </label>
            </div>
            <div className={state.classes.formControl}>
              <label className={state.classes.label} data-testid='sso-type-oidc'>
                <input
                  type='radio'
                  name='connection'
                  value='oidc'
                  className={state.classes.radio}
                  checked={state.newConnectionType === 'oidc'}
                  onChange={(event) => state.handleNewConnectionTypeChange(event)}
                />
                <span className={state.classes.span}>{props.t('oidc')}</span>
              </label>
            </div>
          </div>
        </div>
        <Show when={state.connectionIsSAML}>
          <CreateSAMLConnection
            variant='advanced'
            errorToastCallback={props.errorToastCallback}
            loading={state.loading}
            setupLinkToken={props.setupLinkToken}
            t={props.t}
            cb={props.cb}></CreateSAMLConnection>
        </Show>
        <Show when={state.connectionIsOIDC}>
          <CreateOIDCConnection
            variant='advanced'
            errorToastCallback={props.errorToastCallback}
            loading={state.loading}
            setupLinkToken={props.setupLinkToken}
            t={props.t}
            cb={props.cb}></CreateOIDCConnection>
        </Show>
      </div>
    </div>
  );
}
