import { useStore, Show } from '@builder.io/mitosis';
import CreateOIDCConnection from './oidc/index.lite';
import CreateSAMLConnection from './saml/index.lite';
import type { CreateSSOConnectionProps } from '../types';
import RadioGroup from '../../../shared/RadioGroup/index.lite';
import Radio from '../../../shared/Radio/index.lite';
import Spacer from '../../../shared/Spacer/index.lite';

export default function CreateSSOConnection(props: CreateSSOConnectionProps) {
  const state = useStore({
    newConnectionType: 'saml',
    get connectionIsSAML(): boolean {
      return state.newConnectionType === 'saml';
    },
    get connectionIsOIDC(): boolean {
      return state.newConnectionType === 'oidc';
    },
    handleNewConnectionTypeChange(event: Event) {
      state.newConnectionType = (event.target as HTMLInputElement).value;
    },
  });

  return (
    <div>
      <RadioGroup label='Select SSO type:'>
        <Radio
          name='connection'
          value='saml'
          checked={state.newConnectionType === 'saml'}
          handleInputChange={state.handleNewConnectionTypeChange}>
          SAML
        </Radio>
        <Radio
          name='connection'
          value='oidc'
          checked={state.newConnectionType === 'oidc'}
          handleInputChange={state.handleNewConnectionTypeChange}>
          OIDC
        </Radio>
      </RadioGroup>
      <Spacer y={4} />
      <Show when={state.connectionIsSAML}>
        <CreateSAMLConnection
          urls={props.urls}
          excludeFields={props.excludeFields?.saml}
          readOnlyFields={props.readOnlyFields?.saml}
          classNames={props.classNames}
          variant={props.variant?.saml}
          errorCallback={props.errorCallback}
          successCallback={props.successCallback}
          cancelCallback={props.cancelCallback}
          displayHeader={false}
          defaults={props.defaults}
        />
      </Show>
      <Show when={state.connectionIsOIDC}>
        <CreateOIDCConnection
          urls={props.urls}
          excludeFields={props.excludeFields?.oidc}
          readOnlyFields={props.readOnlyFields?.oidc}
          classNames={props.classNames}
          variant={props.variant?.oidc}
          errorCallback={props.errorCallback}
          successCallback={props.successCallback}
          cancelCallback={props.cancelCallback}
          displayHeader={false}
          defaults={props.defaults}
        />
      </Show>
    </div>
  );
}
