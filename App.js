import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

export default function App() {
  // Request User Permission for Notifications
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
      } else {
        console.log("Permission not granted:", authStatus);
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  useEffect(() => {
    // Request permissions on app load
    requestUserPermission();

    // Get FCM Token
    messaging()
      .getToken()
      .then((token) => {
        console.log("FCM Token:", token);
      });

    // Check whether the app was opened by a notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    // Listen for notifications when the app is in the background but not quit
    const unsubscribeNotificationOpenedApp = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage.notification
        );
      }
    );

    // Handle messages in the foreground
    const unsubscribeForegroundMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("A new FCM message arrived in foreground!", remoteMessage);
      }
    );

    return () => {
      // Cleanup listeners
      unsubscribeNotificationOpenedApp();
      unsubscribeForegroundMessage();
    };
  }, []);

  // Background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background:", remoteMessage);
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to the Mobile Experience of Sahil's Portfolio</Text>
        <Text style={styles.subtitle}>
          a passionate tech enthusiast specializing in MERN stack development and data structures. With a commitment to continuous growth, I aim to create impactful solutions through innovation and teamwork
        </Text>
        <View style={styles.profile}>
          <Image
            source={{
              uri: "https://avatars.githubusercontent.com/u/118194056?s=400&u=7399e110745c8bdbcf4dedbab3e4d54f88db8838&v=4",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>SAHIL</Text>
          <Text style={styles.profileDetails}>
            Technical (SD) @ Dhobi G | Technical Head @ CodezillaClub | Problem
            Solver | Leadership Trait
          </Text>
          <Text style={styles.profileContact}>
            sahilfolio.live | contact@sahilfolio.live
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  profile: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profileDetails: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  profileContact: {
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "center",
  },
});
