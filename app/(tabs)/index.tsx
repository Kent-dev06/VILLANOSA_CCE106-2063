import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequestError, clearStoredSession, getStoredToken, getStudentProfile, loginStudent, StudentProfile } from '@/services/auth';

export default function StudentPortalScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');

  // Restore the saved token before deciding between the Login and Profile screens.
  useEffect(() => {
    void restoreSession();
  }, []);

  // A restored or newly issued token unlocks the protected profile request.
  useEffect(() => {
    if (token) {
      void loadProfile(token);
    }
    // loadProfile intentionally runs only when the session token changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function restoreSession() {
    try {
      const savedToken = await getStoredToken();
      if (savedToken) {
        // Prevent a blank protected screen while the profile request begins.
        setIsProfileLoading(true);
      }
      setToken(savedToken);
    } catch {
      setSessionMessage('Unable to restore your saved session. Please log in again.');
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function loadProfile(accessToken: string) {
    setIsProfileLoading(true);
    setSessionMessage('');

    try {
      setProfile(await getStudentProfile(accessToken));
    } catch (error) {
      if (error instanceof AuthRequestError && error.status === 401) {
        // A rejected token must be cleared from storage and React state.
        await expireSession();
        return;
      }
      setSessionMessage(error instanceof Error ? error.message : 'Unable to load your profile.');
    } finally {
      setIsProfileLoading(false);
    }
  }

  async function expireSession() {
    try {
      await clearStoredSession();
    } catch {
      // Keep the app usable if the device's secure storage is temporarily unavailable.
    } finally {
      // Always remove the rejected token from memory, even if storage fails.
      setToken(null);
      setProfile(null);
      setSessionMessage('Session expired, please log in again.');
    }
  }

  async function handleLogout() {
    setIsLogoutLoading(true);
    try {
      // Clear both SecureStore and in-memory state so logout survives an app restart.
      await clearStoredSession();
      setSessionMessage('You have been logged out.');
      setToken(null);
      setProfile(null);
    } catch {
      setSessionMessage('Unable to update secure storage. Please try logging out again.');
    } finally {
      setIsLogoutLoading(false);
    }
  }

  if (isAuthLoading) {
    return <FullScreenLoader label="Restoring secure session…" />;
  }

  if (!token) {
    return <LoginScreen disabled={isLoginLoading} message={sessionMessage} onLogin={async (email, password) => {
      setIsLoginLoading(true);
      setSessionMessage('');
      try {
        const newToken = await loginStudent(email, password);
        setIsProfileLoading(true);
        setToken(newToken);
      } catch (error) {
        setSessionMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
      } finally {
        setIsLoginLoading(false);
      }
    }} />;
  }

  return (
    <ProfileScreen
      error={sessionMessage}
      isLoading={isProfileLoading}
      isLogoutLoading={isLogoutLoading}
      onLogout={() => void handleLogout()}
      onRetry={() => void loadProfile(token)}
      profile={profile}
    />
  );
}

function LoginScreen({ disabled, message, onLogin }: { disabled: boolean; message: string; onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('admin@mail.com');
  const [password, setPassword] = useState('admin123');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function submitLogin() {
    const cleanEmail = email.trim();
    let hasError = false;

    setEmailError('');
    setPasswordError('');
    if (!cleanEmail) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setEmailError('Enter a valid email address.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    }
    if (!hasError) {
      await onLogin(cleanEmail, password);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>STUDENT SERVICES</Text>
          <Text style={styles.appTitle}>Student Portal</Text>
          <Text style={styles.tagline}>Access your protected student profile securely.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardDescription}>Sign in with your student account.</Text>

            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="student@email.com" placeholderTextColor="#8190A5" style={[styles.input, emailError && styles.inputError]} value={email} />
            {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput autoComplete="password" onChangeText={setPassword} placeholder="Enter password" placeholderTextColor="#8190A5" secureTextEntry style={[styles.input, passwordError && styles.inputError]} value={password} />
            {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
            {message ? <Text style={styles.requestError}>{message}</Text> : null}

            <Pressable accessibilityRole="button" disabled={disabled} onPress={() => void submitLogin()} style={({ pressed }) => [styles.primaryButton, (pressed || disabled) && styles.buttonPressed]}>
              {disabled ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Login</Text>}
            </Pressable>
          </View>
          <Text style={styles.demoHint}>Demo credentials: admin@mail.com / admin123</Text>
          <Text style={styles.secureHint}>Your access token is encrypted with SecureStore.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProfileScreen({ error, isLoading, isLogoutLoading, onLogout, onRetry, profile }: { error: string; isLoading: boolean; isLogoutLoading: boolean; onLogout: () => void; onRetry: () => void; profile: StudentProfile | null }) {
  const initials = profile?.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'SP';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.profileContent}>
        <View style={styles.headerRow}>
          <View><Text style={styles.eyebrow}>AUTHENTICATED AREA</Text><Text style={styles.headerTitle}>My Profile</Text></View>
          <Pressable accessibilityRole="button" disabled={isLogoutLoading} onPress={onLogout} style={[styles.logoutButton, isLogoutLoading && styles.buttonPressed]}>{isLogoutLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.logoutText}>Logout</Text>}</Pressable>
        </View>

        {isLoading ? (
          <View style={styles.profileCard}><ActivityIndicator size="large" color="#1D74B7" /><Text style={styles.loadingLabel}>Loading protected profile…</Text></View>
        ) : error ? (
          <View style={styles.profileCard}><Text style={styles.errorIcon}>!</Text><Text style={styles.profileErrorTitle}>Profile request failed</Text><Text style={styles.profileErrorText}>{error}</Text><Pressable onPress={onRetry} style={styles.retryButton}><Text style={styles.retryText}>Try Again</Text></Pressable></View>
        ) : profile ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            <Text style={styles.studentName}>{profile.name}</Text>
            <View style={styles.roleBadge}><Text style={styles.roleText}>{profile.role ? profile.role.toUpperCase() : 'STUDENT'}</Text></View>
            <View style={styles.divider} />
            <ProfileDetail label="Student ID" value={String(profile.id)} />
            <ProfileDetail label="Email" value={profile.email} />
            <ProfileDetail label="Access" value="Protected session active" />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

function FullScreenLoader({ label }: { label: string }) {
  return <SafeAreaView style={styles.fullScreenLoader}><StatusBar style="light" /><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.fullScreenLabel}>{label}</Text></SafeAreaView>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safeArea: { flex: 1, backgroundColor: '#12355B' }, fullScreenLoader: { alignItems: 'center', backgroundColor: '#12355B', flex: 1, justifyContent: 'center' }, fullScreenLabel: { color: '#FFFFFF', fontSize: 16, marginTop: 16 },
  loginContent: { flexGrow: 1, justifyContent: 'center', padding: 24 }, profileContent: { flex: 1, padding: 24 }, eyebrow: { color: '#A9D9F7', fontSize: 12, fontWeight: '800', letterSpacing: 1.6 }, appTitle: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', letterSpacing: -0.8, marginTop: 6 }, tagline: { color: '#D7E9F5', fontSize: 16, lineHeight: 23, marginBottom: 30, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#061829', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.28, shadowRadius: 22, elevation: 7 }, cardTitle: { color: '#152A3E', fontSize: 25, fontWeight: '800' }, cardDescription: { color: '#607082', fontSize: 15, marginTop: 6 }, inputLabel: { color: '#31475B', fontSize: 13, fontWeight: '800', marginBottom: 8, marginTop: 20 }, input: { backgroundColor: '#F4F7FA', borderColor: '#D7E1EA', borderRadius: 12, borderWidth: 1, color: '#152A3E', fontSize: 16, minHeight: 52, paddingHorizontal: 14 }, inputError: { borderColor: '#D84F5F' }, fieldError: { color: '#BE3647', fontSize: 13, fontWeight: '600', marginTop: 6 }, requestError: { backgroundColor: '#FFF0F1', borderRadius: 9, color: '#A92D3D', fontSize: 13, fontWeight: '600', lineHeight: 19, marginTop: 16, padding: 10 },
  primaryButton: { alignItems: 'center', backgroundColor: '#1479BD', borderRadius: 13, justifyContent: 'center', marginTop: 24, minHeight: 55 }, primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }, buttonPressed: { opacity: 0.72 }, demoHint: { color: '#D7E9F5', fontSize: 13, marginTop: 20, textAlign: 'center' }, secureHint: { color: '#A9D9F7', fontSize: 12, marginTop: 7, textAlign: 'center' },
  headerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 34 }, headerTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 5 }, logoutButton: { borderColor: '#8DCAEE', borderRadius: 10, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 }, logoutText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  profileCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, minHeight: 360, padding: 25, shadowColor: '#061829', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.28, shadowRadius: 22, elevation: 7 }, loadingLabel: { color: '#516273', fontSize: 16, marginTop: 16 }, avatar: { alignItems: 'center', backgroundColor: '#DDF1FE', borderRadius: 45, height: 90, justifyContent: 'center', width: 90 }, avatarText: { color: '#1479BD', fontSize: 28, fontWeight: '800' }, studentName: { color: '#152A3E', fontSize: 25, fontWeight: '800', marginTop: 17, textAlign: 'center' }, roleBadge: { backgroundColor: '#E5F5EA', borderRadius: 999, marginTop: 10, paddingHorizontal: 12, paddingVertical: 6 }, roleText: { color: '#247240', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 }, divider: { backgroundColor: '#E5EBF0', height: 1, marginVertical: 23, width: '100%' }, detailRow: { marginBottom: 17, width: '100%' }, detailLabel: { color: '#718094', fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }, detailValue: { color: '#253C50', fontSize: 16, fontWeight: '700', marginTop: 4 },
  errorIcon: { color: '#D84F5F', fontSize: 26, fontWeight: '900', marginTop: 40 }, profileErrorTitle: { color: '#152A3E', fontSize: 20, fontWeight: '800', marginTop: 12 }, profileErrorText: { color: '#607082', fontSize: 15, lineHeight: 22, marginTop: 8, textAlign: 'center' }, retryButton: { backgroundColor: '#1479BD', borderRadius: 11, marginTop: 22, paddingHorizontal: 18, paddingVertical: 11 }, retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
