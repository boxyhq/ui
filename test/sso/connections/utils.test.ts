import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { deleteConnection, saveConnection } from '../../../src/sso/connections/utils';
import type { FormObj } from '../../../src/sso/connections/types';

const CLIENT_SECRET = 'super-secret-value';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 204,
    headers: new Headers(),
    text: async () => '',
  } as unknown as Response);
  vi.stubGlobal('fetch', fetchMock);
  // saveConnection base64-encodes metadata through window.btoa.
  vi.stubGlobal('window', { btoa: (value: string) => Buffer.from(value).toString('base64') });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const lastRequest = () => {
  const [url, options] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
  return { url, options, headers: (options.headers ?? {}) as Record<string, string> };
};

describe('deleteConnection', () => {
  const callDelete = () =>
    deleteConnection({
      url: '/api/admin/connections',
      clientId: 'client-id-1',
      clientSecret: CLIENT_SECRET,
      callback: async () => {},
    });

  it('identifies the connection by clientID in the query string', async () => {
    await callDelete();

    expect(lastRequest().url).toBe('/api/admin/connections?clientID=client-id-1');
  });

  it('sends the client secret in the x-polis-client-secret header', async () => {
    await callDelete();

    expect(lastRequest().headers['x-polis-client-secret']).toBe(CLIENT_SECRET);
  });

  // The client secret is a reusable credential: request URLs are recorded in
  // browser history, proxy access logs and tracing spans, so it must not
  // appear there under any parameter name.
  it('never puts the client secret in the request URL', async () => {
    await callDelete();

    const { url } = lastRequest();

    expect(url).not.toContain(CLIENT_SECRET);
    expect(new URL(url, 'http://localhost').searchParams.has('clientSecret')).toBe(false);
  });

  it('uses the DELETE method', async () => {
    await callDelete();

    expect(lastRequest().options.method).toBe('DELETE');
  });

  it('hands the response to the callback', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    await deleteConnection({
      url: '/api/admin/connections',
      clientId: 'client-id-1',
      clientSecret: CLIENT_SECRET,
      callback,
    });

    expect(callback).toHaveBeenCalledWith(undefined);
  });
});

describe('saveConnection', () => {
  const formObj = {
    name: 'my-connection',
    tenant: 'acme',
    product: 'demo',
    rawMetadata: '<EntityDescriptor />',
    redirectUrl: ['http://localhost:3000/*'],
    oidcDiscoveryUrl: 'https://idp.example.com/.well-known/openid-configuration',
    oidcClientId: 'oidc-client',
    oidcClientSecret: 'oidc-secret',
    metadataUrl: 'https://idp.example.com/metadata',
  } as unknown as FormObj;

  const body = () => JSON.parse((lastRequest().options.body as string) ?? '{}');

  it('creates with POST and updates with PATCH', async () => {
    await saveConnection({ formObj, callback: async () => {}, url: '/api/v1/sso' });
    expect(lastRequest().options.method).toBe('POST');

    await saveConnection({ formObj, isEditView: true, callback: async () => {}, url: '/api/v1/sso' });
    expect(lastRequest().options.method).toBe('PATCH');
  });

  it('base64-encodes the raw metadata for a SAML connection', async () => {
    await saveConnection({ formObj, connectionIsSAML: true, callback: async () => {}, url: '/api/v1/sso' });

    expect(body().encodedRawMetadata).toBe(Buffer.from('<EntityDescriptor />').toString('base64'));
    expect(body().metadataUrl).toBe('https://idp.example.com/metadata');
    expect(body().rawMetadata).toBeUndefined();
  });

  it('omits the SAML fields for an OIDC connection and sends the OIDC ones', async () => {
    await saveConnection({ formObj, connectionIsOIDC: true, callback: async () => {}, url: '/api/v1/sso' });

    expect(body().encodedRawMetadata).toBeUndefined();
    expect(body().metadataUrl).toBeUndefined();
    expect(body().oidcClientId).toBe('oidc-client');
    expect(body().oidcClientSecret).toBe('oidc-secret');
  });

  it('serialises redirectUrl and sends JSON', async () => {
    await saveConnection({ formObj, callback: async () => {}, url: '/api/v1/sso' });

    expect(body().redirectUrl).toBe(JSON.stringify(['http://localhost:3000/*']));
    expect(lastRequest().headers['Content-Type']).toBe('application/json');
  });
});
