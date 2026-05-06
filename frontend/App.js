import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import GuidesScreen from './src/screens/GuidesScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AttractionDetailScreen from './src/screens/AttractionDetailScreen';
import GuideDetailScreen from './src/screens/GuideDetailScreen';
import ChatScreen from './src/screens/ChatScreen';
import ConversationsScreen from './src/screens/ConversationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#0077B6',
  gray: '#6C757D',
  white: '#FFFFFF',
  bg: '#F0F8FF',
};

function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Explore: focused ? 'compass' : 'compass-outline',
            Guides: focused ? 'people' : 'people-outline',
            Bookings: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Guides" component={GuidesScreen} />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ tabBarLabel: user?.role === 'guide' ? 'Requests' : 'Bookings' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0077B6' }}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>🇱🇰</Text>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 2 }}>SmartTour</Text>
        <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="AttractionDetail"
              component={AttractionDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GuideDetail"
              component={GuideDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Conversations"
              component={ConversationsScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
