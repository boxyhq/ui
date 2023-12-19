import { sendHTTPRequest, ApiResponse } from '../../shared/fetchData';
import type { FormObj, OIDCSSORecord, SAMLSSORecord } from './types';

export const saveConnection = async <T = SAMLSSORecord | OIDCSSORecord>({
  formObj,
  isEditView,
  connectionIsSAML,
  connectionIsOIDC,
  callback,
  url,
}: {
  formObj: FormObj;
  isEditView?: boolean;
  connectionIsSAML?: boolean;
  connectionIsOIDC?: boolean;
  callback: (res: ApiResponse<T>) => Promise<void>;
  url: string;
}) => {
  const {
    rawMetadata,
    redirectUrl,
    oidcDiscoveryUrl,
    oidcMetadata,
    oidcClientId,
    oidcClientSecret,
    metadataUrl,
    ...rest
  } = formObj;

  const encodedRawMetadata = window.btoa((rawMetadata as string) || '');
  const redirectUrlList = (redirectUrl as string)?.split(/\r\n|\r|\n/);

  const res = await sendHTTPRequest<T>(url, {
    method: isEditView ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...rest,
      encodedRawMetadata: connectionIsSAML ? encodedRawMetadata : undefined,
      oidcDiscoveryUrl: connectionIsOIDC ? oidcDiscoveryUrl : undefined,
      oidcMetadata: connectionIsOIDC ? oidcMetadata : undefined,
      oidcClientId: connectionIsOIDC ? oidcClientId : undefined,
      oidcClientSecret: connectionIsOIDC ? oidcClientSecret : undefined,
      redirectUrl: redirectUrl && redirectUrlList ? JSON.stringify(redirectUrlList) : undefined,
      metadataUrl: connectionIsSAML ? metadataUrl : undefined,
    }),
  });
  callback(res);
};

export const deleteConnection = async ({
  url,
  clientId,
  clientSecret,
  callback,
}: {
  url: string;
  clientId: string;
  clientSecret: string;
  callback: (res: ApiResponse<undefined>) => Promise<void>;
}) => {
  const queryParams = new URLSearchParams({
    clientID: clientId,
    clientSecret,
  });
  const res = await sendHTTPRequest<undefined>(`${url}?${queryParams}`, {
    method: 'DELETE',
  });
  callback(res);
};
