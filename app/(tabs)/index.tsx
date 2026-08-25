import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.appTitle}>MY NOTEPAD</Text>
      <Text style={styles.subtitle}>Your simple space for ideas and notes</Text>

      {/* Student Information */}
      <View style={styles.card}>
        <Text style={styles.label}>STUDENT NAME</Text>
        <Text style={styles.value}>Jhon Dave Ledesma</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>COURSE / SECTION</Text>
        <Text style={styles.value}>BSIT - 3rd Year</Text>
      </View>

      {/* App Idea */}
      <View style={styles.noteCard}>
        <Text style={styles.noteIcon}>📝</Text>

        <Text style={styles.label}>MY APP IDEA</Text>

        <Text style={styles.noteTitle}>Personal Notepad</Text>

        <Text style={styles.description}>
          A simple and easy-to-use mobile notepad application where users can
          write, organize, and keep their important notes, ideas, reminders, and
          school information in one convenient place.
        </Text>
      </View>

      {/* Notepad Features */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>NOTEPAD FEATURES</Text>

        <Text style={styles.feature}>✏️ Write New Notes</Text>
        <Text style={styles.feature}>📂 Organize Notes</Text>
        <Text style={styles.feature}>🔍 Find Important Notes</Text>
        <Text style={styles.feature}>💾 Save Your Ideas</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Jhon Dave Ledesma • My Notepad</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF8E7",
    padding: 24,
    paddingTop: 45,
  },

  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3D342B",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#8A7967",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
  },

  noteCard: {
    backgroundColor: "#FFF0B8",
    padding: 22,
    borderRadius: 16,
    marginTop: 5,
    marginBottom: 16,
    elevation: 4,
  },

  featuresCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    elevation: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8A7967",
    letterSpacing: 1,
    marginBottom: 7,
  },

  value: {
    fontSize: 19,
    fontWeight: "600",
    color: "#3D342B",
  },

  noteIcon: {
    fontSize: 32,
    marginBottom: 10,
  },

  noteTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5B4636",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#66584C",
  },

  featuresTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D342B",
    marginBottom: 15,
  },

  feature: {
    fontSize: 15,
    color: "#66584C",
    marginBottom: 12,
  },

  footer: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#8A7967",
    marginTop: 28,
    marginBottom: 15,
  },
});
