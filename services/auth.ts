import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'quotes-app.access-token';
const EMAIL_KEY = 'quotes-app.user-email';

export type Session = {
  token: string;
  email: string;
};

// Demo-only login: replace this validation with a POST request to your backend in production.
export async function signIn(email: string, password: string): Promise<Session> {
  const cleanEmail = email.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || password.length < 6) {
    throw new Error('Enter a valid email and a password with at least 6 characters.');
  }

  const session = {
    email: cleanEmail,
    token: `quotes-session-${Date.now()}`,
  };

  await SecureStore.setItemAsync(TOKEN_KEY, session.token);
  await SecureStore.setItemAsync(EMAIL_KEY, session.email);
  return session;
}

export async function getStoredSession(): Promise<Session | null> {
  const [token, email] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(EMAIL_KEY),
  ]);

  return token && email ? { token, email } : null;
}

export async function signOut(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(EMAIL_KEY),
  ]);
}
