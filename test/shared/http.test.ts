import { describe, expect, it, vi, afterEach } from 'vitest';
import { sendHTTPRequest } from '../../src/shared/http';

const mockFetch = (response: Partial<Response> & { json?: unknown }) => {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const jsonResponse = (body: unknown, init: { status?: number; headers?: Record<string, string> } = {}) => {
  const status = init.status ?? 200;
  const headers = new Headers(init.headers ?? {});

  return {
    ok: status >= 200 && status < 300,
    status,
    headers,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sendHTTPRequest', () => {
  it('returns undefined for 204 No Content without reading the body', async () => {
    const text = vi.fn();
    mockFetch({ ok: true, status: 204, headers: new Headers(), text } as unknown as Response);

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toBeUndefined();
    expect(text).not.toHaveBeenCalled();
  });

  it('parses a JSON body', async () => {
    mockFetch(jsonResponse({ clientID: 'abc' }));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toEqual({ clientID: 'abc' });
  });

  it('returns the raw text when the body is not JSON', async () => {
    mockFetch(jsonResponse('plain text'));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toBe('plain text');
  });

  it('returns an empty string for an empty body', async () => {
    mockFetch(jsonResponse(''));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toBe('');
  });

  it('surfaces the API error message for a non-ok response', async () => {
    mockFetch(jsonResponse({ error: { message: 'clientSecret mismatch' } }, { status: 400 }));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toEqual({
      error: { message: 'clientSecret mismatch' },
    });
  });

  it('wraps the paginated payload when the page token header is present', async () => {
    mockFetch(jsonResponse([{ clientID: 'abc' }], { headers: { 'jackson-pagetoken': 'token-1' } }));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toEqual({
      data: [{ clientID: 'abc' }],
      pageToken: 'token-1',
    });
  });

  it('does not wrap a non-object payload even when a page token is present', async () => {
    mockFetch(jsonResponse('plain text', { headers: { 'jackson-pagetoken': 'token-1' } }));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toBe('plain text');
  });

  it('reports a network failure as an error result rather than throwing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    await expect(sendHTTPRequest('/api/v1/sso')).resolves.toEqual({
      error: { message: 'Failed to fetch' },
    });
  });

  it('passes the request options straight through to fetch', async () => {
    const fetchMock = mockFetch(jsonResponse({}));
    const options = { method: 'DELETE', headers: { 'x-test': '1' } };

    await sendHTTPRequest('/api/v1/sso?clientID=abc', options);

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/sso?clientID=abc', options);
  });
});
