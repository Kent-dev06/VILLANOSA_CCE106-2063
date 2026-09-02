import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Finish React Native activity', dueDate: '2026-09-05', completed: false },
  { id: '2', title: 'Review class notes', dueDate: '2026-09-03', completed: true },
];

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export default function StudentTaskManagerScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [feedback, setFeedback] = useState('Add a task to keep your schoolwork organized.');

  const { pendingCount, completedCount } = useMemo(
    () => ({
      pendingCount: tasks.filter((task) => !task.completed).length,
      completedCount: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  );

  const addTask = () => {
    const cleanTitle = title.trim();
    const cleanDueDate = dueDate.trim();

    if (!cleanTitle || !cleanDueDate) {
      setFeedback('Please provide both a task title and due date.');
      return;
    }

    if (!isValidDate(cleanDueDate)) {
      setFeedback('Use a valid due date in YYYY-MM-DD format.');
      return;
    }

    setTasks((currentTasks) => [
      { id: String(Date.now()), title: cleanTitle, dueDate: cleanDueDate, completed: false },
      ...currentTasks,
    ]);
    setTitle('');
    setDueDate('');
    setFeedback(`Added “${cleanTitle}” to your task list.`);
  };

  const toggleTask = (task: Task) => {
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, completed: !currentTask.completed } : currentTask,
      ),
    );
    setFeedback(task.completed ? `Marked “${task.title}” as pending.` : `Great! “${task.title}” is completed.`);
  };

  const deleteTask = (task: Task) => {
    setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));
    setFeedback(`Deleted “${task.title}” from your task list.`);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.content}
        data={tasks}
        keyExtractor={(task) => task.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first task above.</Text>}
        ListHeaderComponent={
          <>
            <Text style={styles.eyebrow}>MINI PROJECT</Text>
            <Text style={styles.title}>Student Task Manager</Text>
            <Text style={styles.subtitle}>Manage your school tasks in one place.</Text>

            <View style={styles.studentCard}>
              <Text style={styles.studentLabel}>STUDENT</Text>
              <Text style={styles.studentValue}>Kent Ryan Villanosa</Text>
              <Text style={styles.studentLabel}>PROGRAM</Text>
              <Text style={styles.studentValue}>BSIT - 3rd Year</Text>
            </View>

            <View style={styles.counterRow}>
              <View style={[styles.counterCard, styles.pendingCard]}>
                <Text style={styles.counterNumber}>{pendingCount}</Text>
                <Text style={styles.counterLabel}>PENDING</Text>
              </View>
              <View style={[styles.counterCard, styles.completedCard]}>
                <Text style={styles.counterNumber}>{completedCount}</Text>
                <Text style={styles.counterLabel}>COMPLETED</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Add New Task</Text>
              <TextInput
                accessibilityLabel="Task title"
                onChangeText={setTitle}
                placeholder="Task title"
                placeholderTextColor="#8795A1"
                style={styles.input}
                value={title}
              />
              <TextInput
                accessibilityLabel="Due date"
                onChangeText={setDueDate}
                placeholder="Due date (YYYY-MM-DD)"
                placeholderTextColor="#8795A1"
                style={styles.input}
                value={dueDate}
              />
              <Pressable onPress={addTask} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                <Text style={styles.addButtonText}>+ Add Task</Text>
              </Pressable>
              <Text style={styles.feedback}>{feedback}</Text>
            </View>

            <Text style={styles.listHeading}>CURRENT TASKS</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
            <Pressable
              accessibilityLabel={`Mark ${item.title} as ${item.completed ? 'pending' : 'completed'}`}
              onPress={() => toggleTask(item)}
              style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
              <Text style={styles.checkmark}>{item.completed ? '✓' : ''}</Text>
            </Pressable>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</Text>
              <Text style={[styles.dueDate, item.completed && styles.completedText]}>Due: {item.dueDate}</Text>
            </View>
            <Pressable accessibilityLabel={`Delete ${item.title}`} onPress={() => deleteTask(item)} style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F6FA' },
  content: { padding: 20, paddingBottom: 32 },
  eyebrow: { color: '#2D6A4F', fontSize: 12, fontWeight: '800', letterSpacing: 1.3, marginTop: 10 },
  title: { color: '#18352A', fontSize: 29, fontWeight: '800', marginTop: 5 },
  subtitle: { color: '#60746B', fontSize: 15, marginBottom: 20, marginTop: 5 },
  studentCard: { backgroundColor: '#DDEFE5', borderRadius: 16, marginBottom: 14, padding: 18 },
  studentLabel: { color: '#4C7562', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 3 },
  studentValue: { color: '#18352A', fontSize: 17, fontWeight: '700', marginBottom: 12 },
  counterRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  counterCard: { borderRadius: 14, flex: 1, padding: 16 },
  pendingCard: { backgroundColor: '#FFF0CC' },
  completedCard: { backgroundColor: '#DDEFE5' },
  counterNumber: { color: '#18352A', fontSize: 28, fontWeight: '800' },
  counterLabel: { color: '#587063', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 3, padding: 18, shadowColor: '#18352A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
  formTitle: { color: '#18352A', fontSize: 18, fontWeight: '800', marginBottom: 14 },
  input: { backgroundColor: '#F7FAF8', borderColor: '#D2DFD7', borderRadius: 10, borderWidth: 1, color: '#18352A', fontSize: 16, marginBottom: 10, paddingHorizontal: 13, paddingVertical: 12 },
  addButton: { alignItems: 'center', backgroundColor: '#2D6A4F', borderRadius: 10, paddingVertical: 13 },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  feedback: { color: '#4A6257', fontSize: 13, lineHeight: 19, marginTop: 12 },
  listHeading: { color: '#476155', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginBottom: 10, marginTop: 22 },
  taskCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderLeftColor: '#E8A83C', borderLeftWidth: 4, borderRadius: 14, flexDirection: 'row', marginBottom: 10, padding: 14 },
  completedTaskCard: { backgroundColor: '#EAF6EE', borderLeftColor: '#2D6A4F' },
  checkbox: { alignItems: 'center', borderColor: '#7D9587', borderRadius: 12, borderWidth: 2, height: 25, justifyContent: 'center', marginRight: 12, width: 25 },
  checkboxCompleted: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  checkmark: { color: '#FFFFFF', fontSize: 17, fontWeight: '900', lineHeight: 19 },
  taskInfo: { flex: 1 },
  taskTitle: { color: '#1E352A', fontSize: 16, fontWeight: '700' },
  dueDate: { color: '#61776B', fontSize: 13, marginTop: 3 },
  completedText: { color: '#6B8275', textDecorationLine: 'line-through' },
  deleteButton: { marginLeft: 8, padding: 6 },
  deleteText: { color: '#B23A3A', fontSize: 13, fontWeight: '800' },
  empty: { color: '#718177', fontSize: 15, fontStyle: 'italic', textAlign: 'center' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
