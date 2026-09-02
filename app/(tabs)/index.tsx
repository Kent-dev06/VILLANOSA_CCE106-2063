import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Operation = '+' | '-' | '×' | '÷';

export default function CalculatorScreen() {
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [message, setMessage] = useState('Enter two numbers, then choose an operation.');

  const calculate = (operation: Operation) => {
    if (!firstValue.trim() || !secondValue.trim()) {
      setResult(null);
      setMessage('Please enter both numeric values.');
      return;
    }

    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue);

    if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
      setResult(null);
      setMessage('Invalid input. Please enter valid numbers only.');
      return;
    }

    if (operation === '÷' && secondNumber === 0) {
      setResult(null);
      setMessage('Cannot divide by zero. Please change the second value.');
      return;
    }

    const answer =
      operation === '+'
        ? firstNumber + secondNumber
        : operation === '-'
          ? firstNumber - secondNumber
          : operation === '×'
            ? firstNumber * secondNumber
            : firstNumber / secondNumber;

    setResult(String(answer));
    setMessage(`${firstNumber} ${operation} ${secondNumber} =`);
  };

  const clearCalculator = () => {
    setFirstValue('');
    setSecondValue('');
    setResult(null);
    setMessage('Enter two numbers, then choose an operation.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.eyebrow}>MINI PROJECT</Text>
          <Text style={styles.title}>Simple Calculator</Text>
          <Text style={styles.subtitle}>Perform basic operations with two numeric values.</Text>

          <Text style={styles.label}>First number</Text>
          <TextInput
            accessibilityLabel="First number"
            keyboardType="decimal-pad"
            onChangeText={setFirstValue}
            placeholder="e.g. 10"
            placeholderTextColor="#8A99A8"
            style={styles.input}
            value={firstValue}
          />

          <Text style={styles.label}>Second number</Text>
          <TextInput
            accessibilityLabel="Second number"
            keyboardType="decimal-pad"
            onChangeText={setSecondValue}
            placeholder="e.g. 5"
            placeholderTextColor="#8A99A8"
            style={styles.input}
            value={secondValue}
          />

          <View style={styles.operations}>
            {(['+', '-', '×', '÷'] as Operation[]).map((operation) => (
              <Pressable
                accessibilityLabel={`Calculate ${operation}`}
                key={operation}
                onPress={() => calculate(operation)}
                style={({ pressed }) => [styles.operationButton, pressed && styles.buttonPressed]}>
                <Text style={styles.operationText}>{operation}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.resultBox, result === null && styles.messageBox]}>
            <Text style={styles.resultLabel}>{result === null ? 'MESSAGE' : message}</Text>
            <Text style={[styles.resultText, result === null && styles.messageText]}>
              {result ?? message}
            </Text>
          </View>

          <Pressable onPress={clearCalculator} style={({ pressed }) => [styles.clearButton, pressed && styles.buttonPressed]}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EDF4FF' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, elevation: 5, padding: 24, shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
  eyebrow: { color: '#3972C8', fontSize: 12, fontWeight: '800', letterSpacing: 1.4, marginBottom: 6 },
  title: { color: '#14213D', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#617083', fontSize: 15, lineHeight: 22, marginBottom: 24, marginTop: 6 },
  label: { color: '#243B53', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: '#F6F9FD', borderColor: '#D4E0EF', borderRadius: 12, borderWidth: 1, color: '#14213D', fontSize: 20, marginBottom: 18, paddingHorizontal: 16, paddingVertical: 13 },
  operations: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  operationButton: { alignItems: 'center', backgroundColor: '#3972C8', borderRadius: 12, flex: 1, justifyContent: 'center', minHeight: 52 },
  operationText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  buttonPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  resultBox: { backgroundColor: '#E5F2EC', borderRadius: 14, minHeight: 92, padding: 16 },
  messageBox: { backgroundColor: '#FFF5DE' },
  resultLabel: { color: '#397257', fontSize: 13, fontWeight: '800', marginBottom: 5 },
  resultText: { color: '#1D5137', fontSize: 28, fontWeight: '800' },
  messageText: { color: '#805C16', fontSize: 15, fontWeight: '600', lineHeight: 21 },
  clearButton: { alignItems: 'center', marginTop: 18, padding: 10 },
  clearText: { color: '#3972C8', fontSize: 15, fontWeight: '800' },
});
