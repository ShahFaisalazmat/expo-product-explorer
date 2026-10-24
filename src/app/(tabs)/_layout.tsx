import { Tabs } from 'expo-router';
import { Text, Platform, StyleSheet } from 'react-native';
import { Palette } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { HeaderRightActions } from '@/components/common/HeaderActions';

export default function TabLayout() {
  const { favoriteCount } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Palette.deepNavy,
        },
        headerTintColor: Palette.warmIvory,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Palette.warmIvory,
        },
        headerShadowVisible: false,
        headerRight: () => <HeaderRightActions />,
        tabBarStyle: {
          backgroundColor: Palette.deepNavy,
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderTopWidth: 1,
          height: Platform.select({ ios: 88, android: 68, default: 64 }),
          paddingBottom: Platform.select({ ios: 30, android: 12, default: 10 }),
          paddingTop: 8,
        },
        tabBarActiveTintColor: Palette.mutedGold,
        tabBarInactiveTintColor: Palette.secondaryText,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Product Explorer',
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🛍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Saved Favorites',
          tabBarLabel: 'Favorites',
          tabBarBadge: favoriteCount > 0 ? favoriteCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Palette.mutedGold,
            color: Palette.deepNavy,
            fontSize: 10,
            fontWeight: '800',
          },
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>♥</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Student Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
});
