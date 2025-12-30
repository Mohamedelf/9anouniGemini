import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { MessageSquare, BrainCircuit, Clock, User } from 'lucide-react-native';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerType: 'back',
          headerTintColor: '#1F2937',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#6B7280',
          drawerLabelStyle: {
            // marginLeft: -20, // Caused overlap
            fontFamily: 'Inter-Medium', // Example if needed, or just leave empty
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Assistant 9anouni',
            drawerLabel: 'Assistant',
            drawerIcon: ({ color, size }) => (
              <MessageSquare size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="quiz"
          options={{
            title: 'Quiz Code Route',
            drawerLabel: 'Quiz',
            drawerIcon: ({ color, size }) => (
              <BrainCircuit size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: 'Historique',
            drawerLabel: 'Historique',
            drawerIcon: ({ color, size }) => (
              <Clock size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'Mon Profil',
            drawerLabel: 'Profil',
            drawerIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}