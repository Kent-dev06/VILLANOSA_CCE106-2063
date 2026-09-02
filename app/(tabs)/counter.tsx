import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type CounterProps = {
  incrementBy?: number;
};

function Counter({ incrementBy = 1 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Ready to count!');

  const increase = () => {
    setCount((currentCount) => currentCount + incrementBy);
    setMessage(`Added ${incrementBy} to the counter.`);
  };

  const decrease = () => {
    if (count === 0) {
      setMessage('The counter cannot go below zero.');
      return;
    }

    setCount((currentCount) => Math.max(0, currentCount - incrementBy));
    setMessage(`Subtracted ${incrementBy} from the counter.`);
  };

  const reset = () => {
    setCount(0);
    setMessage('Counter reset to zero.');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>CURRENT VALUE</Text>
      <Text accessibilityLabel={`Counter value ${count}`} style={styles.value}>
        {count}
      </Text>
      <Text style={styles.stepText}>Increment value: {incrementBy}</Text>

      <View style={styles.controls}>
        <Pressable accessibilityLabel="Decrease counter" onPress={decrease} style={({ pressed }) => [styles.controlButton, styles.subtractButton, pressed && styles.pressed]}>
          <Text style={styles.controlText}>−</Text>
        </Pressable>
        <Pressable accessibilityLabel="Increase counter" onPress={increase} style={({ pressed }) => [styles.controlButton, styles.addButton, pressed && styles.pressed]}>
          <Text style={[styles.controlText, styles.addControlText]}>+</Text>
        </Pressable>
      </View>

      <Pressable onPress={reset} style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
        <Text style={styles.resetText}>Reset Counter</Text>
      </Pressable>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default function CounterScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>MINI PROJECT</Text>
        <Text style={styles.title}>Counter App</Text>
        <Text style={styles.subtitle}>Use the controls to update the current counter value.</Text>
        <Counter incrementBy={1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F0FF', justifyContent: 'center' },
  content: { padding: 24 },
  eyebrow: { color: '#6557C8', fontSize: 12, fontWeight: '800', letterSpacing: 1.3, marginBottom: 7 },
  title: { color: '#282348', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#6C6887', fontSize: 15, lineHeight: 22, marginBottom: 26, marginTop: 6 },
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, elevation: 5, padding: 28, shadowColor: '#302A58', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
  label: { color: '#716D89', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  value: { color: '#282348', fontSize: 76, fontWeight: '800', marginTop: 4 },
  stepText: { color: '#716D89', fontSize: 14, marginBottom: 25 },
  controls: { flexDirection: 'row', gap: 14, width: '100%' },
  controlButton: { alignItems: 'center', borderRadius: 16, flex: 1, justifyContent: 'center', minHeight: 70 },
  subtractButton: { backgroundColor: '#E9E5FF' },
  addButton: { backgroundColor: '#6557C8' },
  controlText: { color: '#302A58', fontSize: 37, fontWeight: '500' },
  addControlText: { color: '#FFFFFF' },
  resetButton: { marginTop: 18, padding: 8 },
  resetText: { color: '#6557C8', fontSize: 15, fontWeight: '800' },
  message: { color: '#625E7A', fontSize: 13, marginTop: 8, textAlign: 'center' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
