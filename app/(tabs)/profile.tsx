import { Redirect } from 'expo-router';

// The authenticated profile is rendered by the session gate on the home route.
// This prevents the former standalone tab from bypassing that check.
export default function LegacyProfileRoute() {
  return <Redirect href="/" />;
}
