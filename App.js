import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC", 
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A", 
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B", 
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0284C7", 
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#0284C7",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  profileText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A", 
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A", 
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },

  
  activityCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  activityTime: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
});


function MetricCard({ title, value, trend, cardWidth }) {
  return (
    <View style={[styles.metricCard, { width: cardWidth }]}>
      <Text style={styles.metricLabel}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTrend}>{trend}</Text>
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();

  const isWideScreen = width > 600;
  const cardWidth = isWideScreen ? (width - 72) / 3 : (width - 52) / 2;

  const metricsData = [
    {
      id: "1",
      title: "Total Revenue",
      value: "₱48,250",
      trend: "+12% vs last mo",
    },
    { id: "2", title: "Active Users", value: "1,240", trend: "+5% this week" },
    {
      id: "3",
      title: "Completed Tasks",
      value: "89%",
      trend: "+3% efficiency",
    },
  ];

  const activitiesData = [
    {
      id: "1",
      icon: "💰",
      title: "Payment received",
      time: "10 mins ago",
      amount: "+₱2,500",
    },
    {
      id: "2",
      icon: "👤",
      title: "New user registered",
      time: "1 hour ago",
      amount: "User",
    },
    {
      id: "3",
      icon: "🚀",
      title: "Project deployed",
      time: "3 hours ago",
      amount: "System",
    },
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, Developer!</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <Text style={styles.profileText}>KV</Text>
          </TouchableOpacity>
        </View>

        
        <Text style={styles.sectionTitle}>Overview Metrics</Text>
        <View style={styles.metricsContainer}>
          {metricsData.map((item) => (
            <MetricCard
              key={item.id}
              title={item.title}
              value={item.value}
              trend={item.trend}
              cardWidth={cardWidth}
            />
          ))}
        </View>

        
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Task</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activitiesData.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityLeft}>
              <View style={styles.activityIconBg}>
                <Text style={{ fontSize: 16 }}>{activity.icon}</Text>
              </View>
              <View>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
            <Text style={styles.activityAmount}>{activity.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
