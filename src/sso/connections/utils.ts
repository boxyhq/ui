import { FormObj } from './types';

export const saveConnection = async ({
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
  callback: (res: Response) => Promise<void>;
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

  const res = await fetch(url, {
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
