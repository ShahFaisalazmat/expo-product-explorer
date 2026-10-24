import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import { Palette } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
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
          contentStyle: {
            backgroundColor: Palette.warmIvory,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: 'Product Details',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: 'Shopping Cart',
            headerBackTitle: 'Shop',
          }}
        />
        <Stack.Screen
          name="compare"
          options={{
            title: 'Smart Compare',
            headerBackTitle: 'Catalog',
          }}
        />
        <Stack.Screen
          name="budget"
          options={{
            title: 'Budget Finder',
            headerBackTitle: 'Catalog',
          }}
        />
      </Stack>
    </AppProvider>
  );
}
