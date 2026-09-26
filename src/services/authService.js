const BASE_URL = 'https://dummyjson.com';

// Exchange the username and password for the accessToken returned by DummyJSON.
export async function loginUser(username, password) {
  let response;

  try {
    response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });
  } catch {
    throw new Error('Could not connect. Check your internet connection and try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The login server returned an unreadable response.');
  }

  if (!response.ok) {
    throw new Error(typeof data.message === 'string' ? data.message : 'Invalid username or password.');
  }

  if (typeof data.accessToken !== 'string' || !data.accessToken) {
    throw new Error('The login response did not include an access token.');
  }

  return data;
}

// Load the currently authenticated profile using the Bearer token header.
export async function getCurrentUser(token) {
  let response;

  try {
    response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error('Could not connect. Check your internet connection and try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The profile server returned an unreadable response.');
  }

  if (!response.ok) {
    const error = new Error(typeof data.message === 'string' ? data.message : 'Could not load your profile.');
    error.status = response.status;
    throw error;
  }

  return data;
}
