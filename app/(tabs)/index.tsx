import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Title */}
      <Text style={styles.appTitle}>KENT'S MOBILE APP</Text>

      {/* Student Name */}
      <View style={styles.card}>
        <Text style={styles.label}>STUDENT NAME</Text>
        <Text style={styles.value}>Kent Ryan Villanosa</Text>
      </View>

      {/* Course / Section */}
      <View style={styles.card}>
        <Text style={styles.label}>COURSE / SECTION</Text>
        <Text style={styles.value}>BSIT - 3rd Year</Text>
      </View>

      {/* App Idea */}
      <View style={styles.ideaCard}>
        <Text style={styles.label}>MY APP IDEA</Text>
        <Text style={styles.ideaTitle}>Student Productivity App 📱</Text>
        <Text style={styles.description}>
          A mobile application designed to help students manage their tasks,
          schedules, notes, and school activities in one convenient place.
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>My First Mobile App 🚀</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF4F4",
    padding: 24,
    justifyContent: "center",
  },

  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#12343B",
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },

  ideaCard: {
    backgroundColor: "#D7F2F0",
    padding: 20,
    borderRadius: 16,
    marginTop: 5,
    elevation: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#5C7779",
    marginBottom: 6,
  },

  value: {
    fontSize: 20,
    fontWeight: "600",
    color: "#12343B",
  },

  ideaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#12343B",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#345B5F",
  },

  footer: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#5C7779",
    marginTop: 30,
  },
});
