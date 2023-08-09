export interface ConnectionListProps {
  tableCaption?: string;
  hideCols?: ('provider' | 'tenant' | 'product' | 'idp_type' | 'status' | 'actions')[];
  idpEntityID?: string;
  isSettingsView?: boolean;
  getConnectionsUrl: string;
  onListFetchComplete?: (connections: ConnectionData<any>[]) => void;
  onActionClick: (e: ConnectionData<any>) => void;
  /**
   * Classnames for each inner components that make up the component.
   */
  classNames?: {
    container?: string;
    formControl?: string;
    tableContainer?: string;
    table?: string;
    tableCaption?: string;
    thead?: string;
    tr?: string;
    th?: string;
    connectionListContainer?: string;
    td?: string;
    badgeClass?: string;
    tableData?: string;
    spanIcon?: string;
    icon?: string;
  };
}

export interface CreateConnectionProps {
  errorCallback: (errMessage: string) => void;
  successCallback: () => void;
  variant: 'basic' | 'advanced';
  excludeFields?: Array<keyof (SAMLSSOConnection | OIDCSSOConnection)>;
  urls: {
    save: string;
  };
  /**
   * Classnames for each inner components that make up the component.
   */
  classNames?: {
    form?: string;
    container?: string;
    button?: string;
    input?: string;
    radioContainer?: string;
    label?: string;
    fieldContainer?: string;
  };
}

export interface CreateSSOConnectionProps {
  setupLinkToken?: string;
  idpEntityID?: string;
  /**
   * Classnames for each inner components that make up the component.
   */
  classNames?: {
    container?: string;
    formControl?: string;
    selectSSO?: string;
    idpId?: string;
    radio?: string;
    span?: string;
    label?: string;
  };
  componentProps: {
    saml: CreateConnectionProps;
    oidc: CreateConnectionProps;
  };
}

export type ApiSuccess<T> = { data: T; pageToken?: string };

export interface ApiError extends Error {
  info?: string;
  status: number;
}

export type ApiResponse<T = any> = ApiSuccess<T> | { error: ApiError };

type FormObjValues = string | boolean | string[];

export type FormObj = Record<string, FormObjValues | Record<string, FormObjValues>>;

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
  redirectUrl: string[] | string;
  tenant: string;
  product: string;
  name?: string;
  description?: string;
}

export interface SAMLSSOConnection extends SSOConnection {
  forceAuthn?: boolean | string;
  rawMetadata?: string;
  metadataUrl?: string;
}

export interface OIDCSSOConnection extends SSOConnection {
  oidcDiscoveryUrl?: string;
  oidcMetadata?: IssuerMetadata;
  oidcClientId?: string;
  oidcClientSecret?: string;
}

export interface SAMLSSORecord extends SAMLSSOConnection {
  clientID: string; // set by Jackson
  clientSecret: string; // set by Jackson
  metadataUrl?: string;
  redirectUrl: string[];
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

export interface OIDCSSORecord extends SSOConnection {
  clientID: string; // set by Jackson
  clientSecret: string; // set by Jackson
  redirectUrl: string[];
  oidcProvider: {
    provider?: string;
    discoveryUrl?: string;
    metadata?: IssuerMetadata;
    clientId?: string;
    clientSecret?: string;
  };
  deactivated?: boolean;
}

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
  connection: SAMLSSORecord | OIDCSSORecord;
  urls: {
    patch: string;
  };
  translation?: any;
  errorCallback: (errMsg: string) => void;
  successCallback: (successMsg: string) => void;
  classNames?: {
    container?: string;
    heading?: string;
    toggle?: string;
    toggleTransition?: string;
    displayMessage?: string;
    confirmBtn?: string;
    cancelBtn?: string;
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
  connection: OIDCSSORecord;
  variant: 'basic' | 'advanced';
  excludeFields?: Array<keyof (SAMLSSOConnection | OIDCSSOConnection)>;
  errorCallback: (errMessage: string) => void;
  successCallback: () => void;
  urls: {
    delete: string;
    patch: string;
  };
  classNames?: {
    container?: string;
    formDiv?: string;
    fieldsContainer?: string;
    fieldsDiv?: string;
    label?: string;
    input?: string;
    textarea?: string;
    section?: string;
    saveBtn?: string;
    deleteBtn?: string;
    outlineBtn?: string;
  };
}

export interface EditSAMLConnectionProps {
  connection: SAMLSSORecord;
  variant: 'basic' | 'advanced';
  excludeFields?: Array<keyof (SAMLSSOConnection | OIDCSSOConnection)>;
  errorCallback: (errMessage: string) => void;
  successCallback: () => void;
  urls: {
    delete: string;
    patch: string;
  };
  classNames?: {
    container?: string;
    formDiv?: string;
    fieldsContainer?: string;
    fieldsDiv?: string;
    label?: string;
    input?: string;
    textarea?: string;
    section?: string;
    saveBtn?: string;
    deleteBtn?: string;
    outlineBtn?: string;
  };
}

export interface ConnectionsWrapperProp {
  classNames?: { button?: string };
  componentProps: {
    connectionList: Omit<ConnectionListProps, 'onActionClick'>;
    createSSOConnection: Partial<CreateSSOConnectionProps>;
    editOIDCConnection: EditOIDCConnectionProps;
    editSAMLConnection: EditSAMLConnectionProps;
  };
}
