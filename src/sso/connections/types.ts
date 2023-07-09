export interface ConnectionListProps {
  setupLinkToken?: string;
  createConnectionUrl: string;
  idpEntityID?: string;
  isSettingsView?: boolean;
  translation: any;
  slotLinkPrimary: any;
  toastSuccessCallback: () => void;
}

export interface CreateConnectionProps {
  loading: boolean;
  cb: any;
  t: any;
  setupLinkToken?: string;
  errorToastCallback: (errMessage: string) => void;
  variant: 'basic' | 'advanced';
  /**
   * Classnames for each inner components that make up the component.
   */
  classNames?: {
    container?: string;
    button?: string;
    input?: string;
    label?: string;
  };
}

export interface CreateConnectionParentProps {
  setupLinkToken?: string;
  idpEntityID?: string;
  t: any;
  cb: () => void;
  slotLinkBack: any;
  errorToastCallback: () => void;
  successToastCallback: () => void;
}

export interface ToggleConnectionStatusProps {
  connection: SAMLSSORecord | OIDCSSORecord;
  setupLinkToken?: string;
  translation: any;
  errorToastCallback: (errMessage: string) => void;
  successToastCallback: (successMessage: string) => void;
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
  identifierFormat?: string;
}

export interface SAMLSSORecord extends SAMLSSOConnection {
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

export interface OIDCSSORecord extends SSOConnection {
  clientID: string; // set by Jackson
  clientSecret: string; // set by Jackson
  oidcProvider: {
    provider?: string;
    discoveryUrl?: string;
    metadata?: IssuerMetadata;
    clientId?: string;
    clientSecret?: string;
  };
  deactivated?: boolean;
}

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
