import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type AttendanceStatus = 'present' | 'absent' | null;

type Attendance = Record<string, AttendanceStatus>;

type Totals = {
  present: number;
  absent: number;
};

const STUDENTS: string[] = [
  'Alyssa Cruz',
  'Benjamin Santos',
  'Carla Reyes',
  'Daniel Garcia',
  'Erika Mendoza',
  'Francis Torres',
  'Grace Dela Cruz',
  'Harold Ramos',
  'Isabella Flores',
  'Joshua Reyes',
];

export default function Lab08Screen() {
  const [attendance, setAttendance] = useState<Attendance>({});
  const [totals, setTotals] = useState<Totals>({ present: 0, absent: 0 });

  useEffect(() => {
    const nextTotals = STUDENTS.reduce<Totals>(
      (currentTotals, student) => {
        if (attendance[student] === 'present') {
          currentTotals.present += 1;
        }

        if (attendance[student] === 'absent') {
          currentTotals.absent += 1;
        }

        return currentTotals;
      },
      { present: 0, absent: 0 },
    );

    setTotals(nextTotals);
  }, [attendance]);

  const markAttendance = (student: string, status: Exclude<AttendanceStatus, null>) => {
    setAttendance((currentAttendance) => ({
      ...currentAttendance,
      [student]: status,
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Student Attendance</Text>
        <Text style={styles.subtitle}>Tap P or A to record each student's status.</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Attendance Summary</Text>
          <Text style={styles.summaryPresent}>Total Present: {totals.present}</Text>
          <Text style={styles.summaryAbsent}>Total Absent: {totals.absent}</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={[styles.legendBox, styles.presentLegend]}>
            <Text style={styles.legendLetter}>P</Text>
            <Text style={styles.presentText}>Present</Text>
          </View>
          <View style={[styles.legendBox, styles.absentLegend]}>
            <Text style={styles.legendLetter}>A</Text>
            <Text style={styles.absentText}>Absent</Text>
          </View>
        </View>

        <View style={styles.list}>
          {STUDENTS.map((student) => {
            const status = attendance[student] ?? null;
            const isPresent = status === 'present';
            const isAbsent = status === 'absent';

            return (
              <View key={student} style={styles.studentRow}>
                <View style={styles.nameContainer}>
                  <Text style={styles.studentName}>{student}</Text>
                  {isPresent && <Text style={styles.checkMark}>✓</Text>}
                  {isAbsent && <Text style={styles.xMark}>✕</Text>}
                </View>

                <View style={styles.actionButtons}>
                  <Pressable
                    accessibilityLabel={`Mark ${student} present`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isPresent }}
                    onPress={() => markAttendance(student, 'present')}
                    style={[styles.statusButton, styles.presentButton, isPresent && styles.presentButtonActive]}>
                    <Text style={[styles.buttonText, !isPresent && styles.presentButtonText]}>P</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Mark ${student} absent`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isAbsent }}
                    onPress={() => markAttendance(student, 'absent')}
                    style={[styles.statusButton, styles.absentButton, isAbsent && styles.absentButtonActive]}>
                    <Text style={[styles.buttonText, !isAbsent && styles.absentButtonText]}>A</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: '#1F2937',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 20,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  legendBox: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 15,
  },
  presentLegend: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
  },
  absentLegend: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  legendLetter: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: '800',
  },
  presentText: {
    color: '#15803D',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
  absentText: {
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  studentRow: {
    alignItems: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 70,
    paddingHorizontal: 14,
  },
  nameContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 8,
  },
  studentName: {
    color: '#1F2937',
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  checkMark: {
    color: '#16A34A',
    fontSize: 23,
    fontWeight: '800',
    marginLeft: 8,
  },
  xMark: {
    color: '#DC2626',
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  presentButton: {
    backgroundColor: '#BBF7D0',
  },
  presentButtonActive: {
    backgroundColor: '#16A34A',
  },
  absentButton: {
    backgroundColor: '#FECACA',
  },
  absentButtonActive: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  presentButtonText: {
    color: '#15803D',
  },
  absentButtonText: {
    color: '#B91C1C',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    padding: 18,
  },
  summaryTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryPresent: {
    color: '#15803D',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryAbsent: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '600',
  },
});
