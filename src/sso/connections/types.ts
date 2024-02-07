import { ConfirmationPromptProps, TableCol, TableProps } from '../../shared/types';

export interface ConnectionListProps {
  children?: any;
  cols?: ('name' | 'label' | 'provider' | 'tenant' | 'product' | 'type' | 'status' | 'actions' | TableCol)[];
  tableCaption?: string;
  idpEntityID?: string;
  isSettingsView?: boolean;
  urls: {
    get: string;
  };
  errorCallback?: (errMessage: string) => void;
  handleListFetchComplete?: (connections: ConnectionData<any>[]) => void;
  handleActionClick: (action: 'edit', payload: ConnectionData<any>) => void;
  /**
   * Classnames for each inner components that make up the component.
   */
  classNames?: {
    tableContainer?: string;
  };
  tableProps?: TableProps;
  tenant?: string | string[];
  product?: string;
  // If true will sort the list display based on sortOrder of the connection
  displaySorted?: boolean;
  displayPaginated?: boolean;
}

export interface CreateConnectionProps {
  errorCallback?: (errMessage: string) => void;
  successCallback?: (info: {
    operation: 'CREATE';
    connection?: SAMLSSORecord | OIDCSSORecord;
    connectionIsOIDC?: boolean;
    connectionIsSAML?: boolean;
  }) => void;
  cancelCallback?: () => void;
  variant?: 'basic' | 'advanced';
  excludeFields?: Array<keyof SAMLSSOConnection> | Array<keyof OIDCSSOConnection>;
  readOnlyFields?: Array<keyof SSOConnection>;
  urls: {
    post: string;
  };
  /**
   * Classnames for each inner components that make up the component.
   */
  classNames?: {
    form?: string;
    container?: string;
    input?: string;
    select?: string;
    textarea?: string;
    radioContainer?: string;
    label?: string;
    fieldContainer?: string;
    button?: { ctoa?: string };
  };
  /** Use this boolean to toggle the header display on/off. Useful when using the connection component standalone */
  displayHeader?: boolean;
  defaults?: Partial<
    Omit<SSOConnection, 'tenant' | 'sortOrder'> &
      Pick<SAMLSSOConnection, 'forceAuthn'> & { tenant: string[] | string }
  >;
}

export interface CreateSSOConnectionProps
  extends Omit<CreateConnectionProps, 'variant' | 'excludeFields' | 'displayHeader' | 'readOnlyFields'> {
  variant?: {
    saml?: 'basic' | 'advanced';
    oidc?: 'basic' | 'advanced';
  };
  excludeFields?: {
    saml?: Array<keyof SAMLSSOConnection>;
    oidc?: Array<keyof OIDCSSOConnection>;
  };
  readOnlyFields?: {
    saml?: Array<keyof SSOConnection>;
    oidc?: Array<keyof SSOConnection>;
  };
  defaults?: ConnectionsWrapperProp['defaults'];
}

type FormObjValues = string | boolean | string[] | undefined | number;

export type FormObj = Record<string, FormObjValues | Record<string, any>>;

export interface MtlsEndpointAliases {
  token_endpoint?: string;
  userinfo_endpoint?: string;
  revocation_endpoint?: string;
  introspection_endpoint?: string;
  device_authorization_endpoint?: string;
}

export interface IssuerMetadata {
  issuer: string;
  authorization_endpoint?: string;
  token_endpoint?: string;
  jwks_uri?: string;
  userinfo_endpoint?: string;
  revocation_endpoint?: string;
  end_session_endpoint?: string;
  registration_endpoint?: string;
  token_endpoint_auth_methods_supported?: string[];
  token_endpoint_auth_signing_alg_values_supported?: string[];
  introspection_endpoint_auth_methods_supported?: string[];
  introspection_endpoint_auth_signing_alg_values_supported?: string[];
  revocation_endpoint_auth_methods_supported?: string[];
  revocation_endpoint_auth_signing_alg_values_supported?: string[];
  request_object_signing_alg_values_supported?: string[];
  mtls_endpoint_aliases?: MtlsEndpointAliases;

  [key: string]: unknown;
}

interface SSOConnection {
  defaultRedirectUrl: string;
  redirectUrl: string;
  tenant: string;
  product: string;
  name?: string;
  label?: string;
  description?: string;
  // to support null values use empty string ''
  sortOrder?: string | number;
}

export interface SAMLSSOConnection extends SSOConnection {
  forceAuthn?: boolean;
  rawMetadata?: string;
  metadataUrl?: string;
}

export interface OIDCSSOConnection extends SSOConnection {
  oidcDiscoveryUrl?: string;
  oidcMetadata?: IssuerMetadata;
  oidcClientId?: string;
  oidcClientSecret?: string;
}

export interface SAMLSSORecord extends Omit<SAMLSSOConnection, 'redirectUrl'> {
  redirectUrl: string[];
  clientID: string; // set by Jackson
  clientSecret: string; // set by Jackson
  metadataUrl?: string;
  idpMetadata: {
    entityID: string;
    loginType?: string;
    provider: string | 'Unknown';
    friendlyProviderName: string | null;
    slo: {
      postUrl?: string;
      redirectUrl?: string;
    };
    sso: {
      postUrl?: string;
      redirectUrl?: string;
    };
    thumbprint?: string;
    validTo?: string;
  };
  deactivated?: boolean;
}

export type SAMLFormState = {
  [K in keyof SAMLSSORecord]: K extends 'redirectUrl' ? string : SAMLSSORecord[K];
};

export interface OIDCSSORecord extends Omit<SSOConnection, 'redirectUrl'> {
  redirectUrl: string[];
  clientID: string; // set by Jackson
  clientSecret: string; // set by Jackson
  oidcProvider: {
    provider: string | 'Unknown';
    friendlyProviderName: string | null;
    discoveryUrl?: string;
    metadata?: IssuerMetadata;
    clientId?: string;
    clientSecret?: string;
  };
  deactivated?: boolean;
}

export type OIDCFormState = {
  [K in keyof OIDCSSORecord]: K extends 'redirectUrl' ? string : OIDCSSORecord[K];
} & {
  oidcClientSecret: string;
  oidcClientId: string;
  oidcDiscoveryUrl: string;
  'oidcMetadata.issuer': string;
  'oidcMetadata.authorization_endpoint': string;
  'oidcMetadata.token_endpoint': string;
  'oidcMetadata.jwks_uri': string;
  'oidcMetadata.userinfo_endpoint': string;
};

export type ConnectionData<T extends SAMLSSORecord | OIDCSSORecord> = T & { isSystemSSO?: boolean };

declare namespace classNames {
  type Value = string | number | boolean | undefined | null;
  type Mapping = Record<string, unknown>;
  interface ArgumentArray extends Array<Argument> {}
  type Argument = Value | Mapping | ArgumentArray;
}

/**
 * A simple JavaScript utility for conditionally joining classNames together.
 */
export declare function classNames(...args: classNames.ArgumentArray): string;

export interface ToggleConnectionStatusProps {
  connection: SAMLFormState | OIDCFormState;
  urls: {
    patch: string;
  };
  translation?: any;
  errorCallback?: (errMsg: string) => void;
  successCallback?: (info: any) => void;
  classNames?: {
    container?: string;
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
  };
}

export interface EditConnectionProps {
  connection: SAMLSSORecord | OIDCSSORecord;
  editConnectionUrls: {
    save: string;
    delete: string;
  };
  toggleConnectionUrls: {
    save: string;
  };
  translation?: any;
  errorCallback: (errMsg: string) => void;
  successCallback: (successMsg: string) => void;
}

export interface EditOIDCConnectionProps {
  variant: 'basic' | 'advanced';
  excludeFields?: Array<keyof OIDCSSOConnection>;
  errorCallback?: (errMessage: string) => void;
  successCallback?: (info: {
    operation: 'UPDATE' | 'DELETE' | 'COPY';
    connection?: Partial<OIDCFormState>;
    connectionIsOIDC?: true;
  }) => void;
  cancelCallback?: () => void;
  urls: {
    delete: string;
    patch: string;
    get: string;
  };
  classNames?: {
    button?: { ctoa?: string; destructive?: string };
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
    fieldContainer?: string;
    secretInput?: string;
    container?: string;
    formDiv?: string;
    fieldsContainer?: string;
    fieldsDiv?: string;
    label?: string;
    input?: string;
    textarea?: string;
    section?: string;
  };
  /** Use this boolean to toggle the header display on/off. Useful when using the connection component standalone */
  displayHeader?: boolean;
  /** Use this boolean to toggle the info card display on/off. Useful when using the connection component standalone */
  displayInfo?: boolean;
}

export interface EditSAMLConnectionProps {
  variant: 'basic' | 'advanced';
  excludeFields?: Array<keyof SAMLSSOConnection>;
  errorCallback?: (errMessage: string) => void;
  successCallback?: (info: {
    operation: 'UPDATE' | 'DELETE' | 'COPY';
    connection?: Partial<SAMLFormState>;
    connectionIsSAML?: true;
  }) => void;
  cancelCallback?: () => void;
  urls: {
    delete: string;
    patch: string;
    get: string;
  };
  classNames?: {
    button?: { ctoa?: string; destructive?: string };
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
    fieldContainer?: string;
    secretInput?: string;
    formDiv?: string;
    label?: string;
    input?: string;
    textarea?: string;
    section?: string;
  };
  /** Use this boolean to toggle the header display on/off. Useful when using the connection component standalone */
  displayHeader?: boolean;
  /** Use this boolean to toggle the info card display on/off. Useful when using the connection component standalone */
  displayInfo?: boolean;
}

export interface ConnectionsWrapperProp {
  title?: string;
  defaults?: Partial<SSOConnection & Pick<SAMLSSOConnection, 'forceAuthn'> & { tenants: string[] }>;
  classNames?: {
    button?: { ctoa?: string; destructive?: string };
    input?: string;
    select?: string;
    textarea?: string;
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
    secretInput?: string;
    section?: string;
  };
  successCallback?: (info: {
    operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'COPY';
    connection?: Partial<SAMLSSORecord | OIDCSSORecord | SAMLFormState | OIDCFormState>;
    connectionIsSAML?: boolean;
    connectionIsOIDC?: boolean;
  }) => void;
  errorCallback?: (errMessage: string) => void;
  componentProps: {
    connectionList: Partial<Omit<ConnectionListProps, 'handleActionClick'>>;
    createSSOConnection?: Partial<CreateSSOConnectionProps>;
    editOIDCConnection?: Partial<EditOIDCConnectionProps>;
    editSAMLConnection?: Partial<EditSAMLConnectionProps>;
  };
  urls: {
    spMetadata?: string;
    get: string;
    post: string;
    patch: string;
    delete: string;
  };
}
