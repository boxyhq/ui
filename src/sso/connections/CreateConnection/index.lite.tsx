import { useStore, Show, Slot } from '@builder.io/mitosis';
import CreateOIDCConnection from './oidc/index.lite';
import CreateSAMLConnection from './saml/index.lite';
import type { CreateSSOConnectionProps } from '../types';
import defaultClasses from './index.module.css';
import cssClassAssembler from '../../utils/cssClassAssembler';
import InputWithCopyButton from '../../../shared/InputWithCopyButton/index.lite';

export default function CreateSSOConnection(props: CreateSSOConnectionProps) {
  const state = useStore({
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
        formControl: cssClassAssembler(props.classNames?.formControl, defaultClasses.formControl),
        selectSSO: cssClassAssembler(props.classNames?.selectSSO, defaultClasses.selectSSO),
        idpId: cssClassAssembler(props.classNames?.idpId, defaultClasses.idpId),
        radio: cssClassAssembler(props.classNames?.radio, defaultClasses.radio),
        span: cssClassAssembler(props.classNames?.span, defaultClasses.span),
        label: cssClassAssembler(props.classNames?.label, defaultClasses.label),
      };
    },
    handleNewConnectionTypeChange(event: Event) {
      state.newConnectionType = (event.target as HTMLInputElement).value;
    },
    toastSuccessCallback() {
      console.log(`copied to clipboard`);
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
              label='IdP Entity ID'
              toastSuccessCallback={state.toastSuccessCallback}
            />
          </div>
        </div>
      </Show>
      <div>
        <fieldset className={state.classes.container}>
          <legend className={state.classes.selectSSO}>Select SSO type</legend>
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
              <span className={state.classes.span}>SAML</span>
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
              <span className={state.classes.span}>OIDC</span>
            </label>
          </div>
        </fieldset>
        <Show when={state.connectionIsSAML}>
          <CreateSAMLConnection
            urls={props.componentProps.saml.urls}
            excludeFields={props.componentProps.saml.excludeFields}
            classNames={props.componentProps.saml.classNames}
            variant='advanced'
            errorCallback={props.componentProps.saml.errorCallback}
            successCallback={props.componentProps.saml.successCallback}></CreateSAMLConnection>
        </Show>
        <Show when={state.connectionIsOIDC}>
          <CreateOIDCConnection
            urls={props.componentProps.oidc.urls}
            classNames={props.componentProps.oidc.classNames}
            variant='advanced'
            errorCallback={props.componentProps.oidc.errorCallback}
            successCallback={props.componentProps.oidc.successCallback}></CreateOIDCConnection>
        </Show>
      </div>
    </div>
  );
}
