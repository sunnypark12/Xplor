import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TravelProvider } from './src/contexts/TravelContext';
import LandingScreen from './src/screens/Landing';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HowItWorksScreen from './src/screens/HowItWorks';
import HomeScreen from './src/screens/Home';
import DashboardScreen from './src/screens/Dashboard';
import QuizScreen from './src/screens/Quiz';
import TripPlanningScreen from './src/screens/TripPlanning';
import ItineraryScreen from './src/screens/Itinerary';
import ProfileScreen from './src/screens/Profile';

const Stack = createNativeStackNavigator();

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
  if (!user) return <LoginScreen />;
  return <>{children}</>;
}

function Smart({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
  const hasProfile = user && user.travelProfile && typeof user.travelProfile === 'object' && Object.keys(user.travelProfile).length > 0;
  if (!hasProfile) return <QuizScreen />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <TravelProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Public */}
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
            {/* Protected */}
            <Stack.Screen name="Home" children={() => (
              <Protected>
                <HomeScreen />
              </Protected>
            )} />
            <Stack.Screen name="Dashboard" children={() => (
              <Smart>
                <DashboardScreen />
              </Smart>
            )} />
            <Stack.Screen name="Quiz" children={() => (
              <Protected>
                <QuizScreen />
              </Protected>
            )} />
            <Stack.Screen name="TripPlanning" children={() => (
              <Smart>
                <TripPlanningScreen />
              </Smart>
            )} />
            <Stack.Screen name="Itinerary" children={() => (
              <Smart>
                <ItineraryScreen />
              </Smart>
            )} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </TravelProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
