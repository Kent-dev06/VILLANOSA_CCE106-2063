import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://api.escuelajs.co/api/v1';
const TOKEN_KEY = 'student-portal.access-token';

export type StudentProfile = {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
};

export class AuthRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'AuthRequestError';
  }
}

type LoginResponse = { access_token?: unknown };

// Sends credentials to the API and saves its documented access_token exactly as returned.
export async function loginStudent(email: string, password: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    const data: LoginResponse = await response.json();

    if (!response.ok) {
      throw new AuthRequestError('Invalid email or password. Please try again.', response.status);
    }

    // The Platzi Fake Store API returns the JWT in `access_token`.
    if (typeof data.access_token !== 'string' || !data.access_token) {
      throw new AuthRequestError('Login response did not include an access token.');
    }

    await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
    return data.access_token;
  } catch (error) {
    if (error instanceof AuthRequestError) {
      throw error;
    }
    throw new AuthRequestError('Unable to connect. Check your internet connection and try again.');
  }
}

// Restores the saved token before the app chooses which screen to display.
export function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export function clearStoredSession(): Promise<void> {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

// Calls the API's protected endpoint with the persisted Bearer token.
export async function getStudentProfile(token: string): Promise<StudentProfile> {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      throw new AuthRequestError('Session expired, please log in again.', 401);
    }

    if (!response.ok) {
      throw new AuthRequestError('Unable to load your profile. Please try again.', response.status);
    }

    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') {
      throw new AuthRequestError('Profile data is unavailable.');
    }

    const profile = data as Record<string, unknown>;
    if (typeof profile.id !== 'number' || typeof profile.name !== 'string' || typeof profile.email !== 'string') {
      throw new AuthRequestError('Profile data is incomplete.');
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: typeof profile.role === 'string' ? profile.role : undefined,
      avatar: typeof profile.avatar === 'string' ? profile.avatar : undefined,
    };
  } catch (error) {
    if (error instanceof AuthRequestError) {
      throw error;
    }
    throw new AuthRequestError('Unable to connect. Check your internet connection and try again.');
  }
}
