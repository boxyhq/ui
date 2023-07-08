import { FormObj } from './types';

export const saveConnection = async ({
  formObj,
  isEditView,
  connectionIsSAML,
  connectionIsOIDC,
  setupLinkToken,
  callback,
}: {
  formObj: FormObj;
  isEditView?: boolean;
  connectionIsSAML?: boolean;
  connectionIsOIDC?: boolean;
  setupLinkToken?: string;
  callback: (res: Response) => Promise<void>;
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

  const encodedRawMetadata = btoa((rawMetadata as string) || '');
  const redirectUrlList = redirectUrl as string;

  const res = await fetch(
    setupLinkToken ? `/api/setup/${setupLinkToken}/sso-connection` : '/api/admin/connections',
    {
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
    }
  );
  callback(res);
};

export default function FieldList() {
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
}
