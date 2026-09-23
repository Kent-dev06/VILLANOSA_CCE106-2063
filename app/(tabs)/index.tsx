import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStoredSession, Session, signIn, signOut } from '@/services/auth';
import { ApiRequestError, getRandomQuote } from '@/services/quotes';

export default function QuotesScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('student@quotes.app');
  const [password, setPassword] = useState('123456');
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [isRestoring, setIsRestoring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Restore an existing encrypted session after the app opens.
  useEffect(() => {
    void restoreSession();
  }, []);

  // A successful login automatically fetches protected content.
  useEffect(() => {
    if (session) {
      void loadQuote(session.token);
    }
  }, [session]);

  async function restoreSession() {
    try {
      setSession(await getStoredSession());
    } catch {
      setError('Unable to restore your saved session. Please log in again.');
    } finally {
      setIsRestoring(false);
    }
  }

  async function handleLogin() {
    setIsLoading(true);
    setError('');

    try {
      setSession(await signIn(email, password));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadQuote(accessToken: string) {
    setIsLoading(true);
    setError('');

    try {
      const quote = await getRandomQuote(accessToken);
      setQuoteText(quote.text);
      setAuthor(quote.author);
    } catch (requestError) {
      setQuoteText('');
      setAuthor('');
      const message = requestError instanceof Error ? requestError.message : 'Unable to load a quote right now.';
      setError(message);

      // Invalid or forbidden sessions must no longer access protected data.
      if (requestError instanceof ApiRequestError && (requestError.status === 401 || requestError.status === 403)) {
        await signOut();
        setSession(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);
    await signOut();
    setSession(null);
    setQuoteText('');
    setAuthor('');
    setError('');
    setIsLoading(false);
  }

  if (isRestoring) {
    return <LoadingScreen message="Checking your secure session…" />;
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.container}>
          <Text style={styles.eyebrow}>QUOTES APP</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to unlock your daily inspiration.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>
            <Text style={styles.cardHint}>Demo: use any valid email and a 6-character password.</Text>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#918BA2"
              style={styles.input}
              value={email}
            />
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoComplete="password"
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="#918BA2"
              secureTextEntry
              style={styles.input}
              value={password}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable disabled={isLoading} onPress={() => void handleLogin()} style={({ pressed }) => [styles.button, (pressed || isLoading) && styles.buttonPressed]}>
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login securely</Text>}
            </Pressable>
          </View>
          <Text style={styles.securityNote}>Your session token is saved with Expo SecureStore.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasQuote = Boolean(quoteText && author);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>PROTECTED QUOTES</Text>
            <Text style={styles.userText}>{session.email}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => void handleLogout()} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Quotes App</Text>
        <Text style={styles.subtitle}>A thought worth keeping close.</Text>

        <View style={styles.card}>
          {isLoading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color="#6D5DFB" />
              <Text style={styles.stateTitle}>Finding a great quote…</Text>
            </View>
          ) : error ? (
            <View style={styles.stateContainer}>
              <Text style={styles.stateIcon}>!</Text>
              <Text style={styles.stateTitle}>Request unavailable</Text>
              <Text style={styles.stateText}>{error}</Text>
            </View>
          ) : hasQuote ? (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteText}>{quoteText}</Text>
              <View style={styles.authorRow}><View style={styles.authorLine} /><Text style={styles.author}> {author}</Text></View>
            </View>
          ) : (
            <View style={styles.stateContainer}>
              <Text style={styles.stateTitle}>No quote available yet</Text>
              <Text style={styles.stateText}>Request a new quote to begin.</Text>
            </View>
          )}
        </View>

        <Pressable disabled={isLoading} onPress={() => void loadQuote(session.token)} style={({ pressed }) => [styles.button, (pressed || isLoading) && styles.buttonPressed]}>
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{error ? 'Try Again' : 'New Quote'}</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return <SafeAreaView style={styles.loadingScreen}><StatusBar style="light" /><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.loadingText}>{message}</Text></SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#211C46' }, loadingScreen: { alignItems: 'center', backgroundColor: '#211C46', flex: 1, justifyContent: 'center' }, loadingText: { color: '#FFFFFF', fontSize: 16, marginTop: 16 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 28 }, topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  eyebrow: { color: '#B9B3F7', fontSize: 12, fontWeight: '800', letterSpacing: 1.8 }, userText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 5 }, title: { color: '#FFFFFF', fontSize: 38, fontWeight: '800', letterSpacing: -1, marginTop: 6 }, subtitle: { color: '#D5D2EC', fontSize: 16, marginTop: 7, marginBottom: 28 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 28, minHeight: 290, justifyContent: 'center', padding: 28, shadowColor: '#000000', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.24, shadowRadius: 24, elevation: 8 }, cardTitle: { color: '#29253D', fontSize: 25, fontWeight: '800' }, cardHint: { color: '#625D73', fontSize: 14, lineHeight: 20, marginBottom: 20, marginTop: 7 },
  inputLabel: { color: '#474158', fontSize: 13, fontWeight: '800', marginBottom: 7, marginTop: 13 }, input: { backgroundColor: '#F4F2FA', borderColor: '#E3E0EE', borderRadius: 12, borderWidth: 1, color: '#29253D', fontSize: 16, minHeight: 52, paddingHorizontal: 14 }, errorText: { color: '#C63B46', fontSize: 13, fontWeight: '600', lineHeight: 18, marginTop: 15 },
  quoteContainer: { alignItems: 'flex-start' }, quoteMark: { color: '#6D5DFB', fontFamily: 'serif', fontSize: 64, fontWeight: '700', height: 52, lineHeight: 72 }, quoteText: { color: '#29253D', fontSize: 24, fontWeight: '700', letterSpacing: -0.35, lineHeight: 34, marginTop: 8 }, authorRow: { alignItems: 'center', flexDirection: 'row', marginTop: 26 }, authorLine: { backgroundColor: '#6D5DFB', height: 2, width: 24 }, author: { color: '#625D73', fontSize: 15, fontWeight: '700' },
  stateContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 }, stateIcon: { color: '#D64A4A', fontSize: 24, fontWeight: '900', marginBottom: 12 }, stateTitle: { color: '#29253D', fontSize: 19, fontWeight: '800', textAlign: 'center' }, stateText: { color: '#625D73', fontSize: 15, lineHeight: 22, marginTop: 8, textAlign: 'center' },
  button: { alignItems: 'center', backgroundColor: '#6D5DFB', borderRadius: 16, justifyContent: 'center', marginTop: 24, minHeight: 56, shadowColor: '#100B35', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 5 }, buttonPressed: { opacity: 0.75, transform: [{ scale: 0.99 }] }, buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  logoutButton: { borderColor: '#938AE8', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 }, logoutText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' }, securityNote: { color: '#B9B3F7', fontSize: 12, marginTop: 18, textAlign: 'center' },
});
