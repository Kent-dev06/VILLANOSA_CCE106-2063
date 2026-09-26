import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getCurrentUser, loginUser } from './src/services/authService';
import { deleteToken, getToken, saveToken } from './src/storage/tokenStorage';

export default function App() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Restore the secure token first so the login form does not flash on app launch.
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      setCheckingSession(true);
      try {
        const token = await getToken();
        if (token) {
          const user = await getCurrentUser(token);
          if (isMounted) setProfile(user);
        }
      } catch {
        // A rejected token must not be reused on the next app launch.
        try {
          await deleteToken();
        } catch {
          // Stay logged out even if secure storage cannot be cleared right now.
        }
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    }

    void restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(username.trim(), password);
      await saveToken(data.accessToken);
      const user = await getCurrentUser(data.accessToken);
      setProfile(user);
    } catch {
      // Do not leave a token behind if profile loading failed after login.
      try {
        await deleteToken();
      } catch {
        // The friendly login error remains the only message shown to the user.
      }
      setError('Login failed. Check your username and password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError('');
    try {
      await deleteToken();
      setProfile(null);
    } catch {
      setError('Could not securely log out. Please try again.');
    }
  }

  if (checkingSession) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {profile ? (
            <View style={styles.profileCard}>
              <Text style={styles.eyebrow}>SECURE PROFILE</Text>
              {profile.image ? (
                <Image source={{ uri: profile.image }} style={styles.avatar} />
              ) : null}
              <Text style={styles.name}>
                {profile.firstName} {profile.lastName}
              </Text>
              <View style={styles.details}>
                <ProfileValue label="Username" value={profile.username} />
                <ProfileValue label="Email" value={profile.email} />
                <ProfileValue label="User ID" value={String(profile.id)} />
              </View>
              <Pressable accessibilityRole="button" onPress={() => void handleLogout()} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Logout</Text>
              </Pressable>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          ) : (
            <View style={styles.loginCard}>
              <View style={styles.brandMark}><Text style={styles.brandMarkText}>SP</Text></View>
              <Text style={styles.title}>Secure Profile</Text>
              <Text style={styles.subtitle}>Sign in to view your profile.</Text>

              <Text style={styles.label}>Username</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={() => void handleLogin()}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />

              {error ? <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={loading}
                onPress={() => void handleLogin()}
                style={({ pressed }) => [styles.primaryButton, (pressed || loading) && styles.buttonDimmed]}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.primaryButtonText}>Logging in...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Login</Text>
                )}
              </Pressable>
              <Text style={styles.demoHint}>Demo: emilys / emilyspass</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProfileValue({ label, value }) {
  return (
    <View style={styles.profileValue}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text selectable style={styles.profileText}>{value || 'Not provided'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: '#F1F5F9', flex: 1 },
  loadingScreen: { alignItems: 'center', backgroundColor: '#F1F5F9', flex: 1, justifyContent: 'center' },
  loadingText: { color: '#475569', fontSize: 16, marginTop: 14 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  loginCard: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 24, borderWidth: 1, padding: 26, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18, elevation: 4 },
  brandMark: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#DBEAFE', borderRadius: 24, height: 58, justifyContent: 'center', width: 58 },
  brandMarkText: { color: '#1D4ED8', fontSize: 18, fontWeight: '800' },
  title: { color: '#0F172A', fontSize: 29, fontWeight: '800', marginTop: 18, textAlign: 'center' },
  subtitle: { color: '#64748B', fontSize: 15, marginBottom: 24, marginTop: 7, textAlign: 'center' },
  label: { color: '#334155', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1', borderRadius: 12, borderWidth: 1, color: '#0F172A', fontSize: 16, minHeight: 52, paddingHorizontal: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 12, justifyContent: 'center', marginTop: 24, minHeight: 52 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  buttonContent: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  buttonDimmed: { opacity: 0.7 },
  errorText: { color: '#B91C1C', fontSize: 14, lineHeight: 20, marginTop: 14, textAlign: 'center' },
  demoHint: { color: '#64748B', fontSize: 12, marginTop: 18, textAlign: 'center' },
  profileCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 24, borderWidth: 1, padding: 26, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18, elevation: 4 },
  eyebrow: { color: '#2563EB', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  avatar: { backgroundColor: '#DBEAFE', borderRadius: 48, height: 96, marginTop: 22, width: 96 },
  name: { color: '#0F172A', fontSize: 25, fontWeight: '800', marginTop: 18, textAlign: 'center' },
  details: { alignSelf: 'stretch', borderTopColor: '#E2E8F0', borderTopWidth: 1, marginTop: 24, paddingTop: 8 },
  profileValue: { marginTop: 15 },
  profileLabel: { color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  profileText: { color: '#1E293B', fontSize: 16, marginTop: 4 },
  secondaryButton: { alignItems: 'center', alignSelf: 'stretch', borderColor: '#CBD5E1', borderRadius: 12, borderWidth: 1, marginTop: 26, minHeight: 50, justifyContent: 'center' },
  secondaryButtonText: { color: '#334155', fontSize: 15, fontWeight: '700' },
});
