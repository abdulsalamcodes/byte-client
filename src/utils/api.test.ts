import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ApiError, fetchCurrentUser, isUnauthorized, login } from './api';

function mockFetch(status: number, body: unknown) {
  const fetchMock = jest.fn(async () => new Response(JSON.stringify(body), { status }));
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('api errors', () => {
  it('surfaces FastAPI string details and flags 401s', async () => {
    mockFetch(401, { detail: 'Incorrect email or password' });

    const error = await login('ada@example.com', 'wrong').catch((err: unknown) => err);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBe('Incorrect email or password');
    expect(isUnauthorized(error)).toBe(true);
  });

  it('joins FastAPI validation messages', async () => {
    mockFetch(422, { detail: [{ msg: 'Field required' }, { msg: 'Too short' }] });

    await expect(login('', '')).rejects.toThrow('Field required Too short');
  });
});

describe('auth requests', () => {
  it('logs in with the OAuth2 form fields', async () => {
    const fetchMock = mockFetch(200, { access_token: 'token', token_type: 'bearer' });

    await login('ada@example.com', 'secret-password');

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(init.body)).toBe('username=ada%40example.com&password=secret-password');
  });

  it('sends the bearer token', async () => {
    const fetchMock = mockFetch(200, { id: '1', email: 'ada@example.com', display_name: 'Ada' });

    await fetchCurrentUser('abc');

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/auth\/me$/);
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer abc');
  });
});
