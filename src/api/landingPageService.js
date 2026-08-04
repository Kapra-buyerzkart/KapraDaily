import CONFIG from '../globals/config';

const LANDING_PAGES_URL = `${CONFIG.base_url}landingpages`;

/**
 * Plain fetch for the landing pages endpoint. No auth header — the endpoint is
 * public — and no interceptor layer, so what you see logged is what the server
 * actually returned.
 * @returns {Promise<Object>} the raw `{ success, data, ... }` envelope.
 */
export const getLandingPagesApi = async () => {
  console.log('[landingPages] GET', LANDING_PAGES_URL);

  const response = await fetch(LANDING_PAGES_URL, {
    method: 'GET',
    headers: {
      lang: '2',
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();

  console.log(
    '[landingPages] Response:',
    response.status,
    JSON.stringify(body, null, 2),
  );

  if (!response.ok) {
    const error = new Error(
      body?.message || body?.Message || 'Failed to load landing pages.',
    );
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
};
