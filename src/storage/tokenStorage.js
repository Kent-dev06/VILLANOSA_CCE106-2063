import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';

// Store the access token in the device's secure storage.
export async function saveToken(token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    throw new Error('Could not securely save your session.');
  }
}

// Read the saved token, or return null when there is no saved session.
export async function getToken() {
  try {
    return (await SecureStore.getItemAsync(TOKEN_KEY)) ?? null;
  } catch {
    throw new Error('Could not read your saved session.');
  }
}

// Remove the saved token when the user logs out or their session expires.
export async function deleteToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    throw new Error('Could not securely clear your session.');
  }
}
