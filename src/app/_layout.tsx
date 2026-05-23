// import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
// import { useColorScheme } from 'react-native';

// import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <AnimatedSplashOverlay />
//       <AppTabs />
//     </ThemeProvider>
//   );
// }


import { AnimTabButton } from '@/components/AnimTabButton';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          height: 65,
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 16,
          backgroundColor: '#ffffff',
          // Optional: Add shadow/elevation styling here to make it float clean
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: (props) => (
            <AnimTabButton
              {...props}
              item={{
                label: 'Home',
                activeIcon: 'home',
                inActiveIcon: 'home-outline',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarButton: (props) => (
            <AnimTabButton
              {...props}
              item={{
                label: 'Explore',
                activeIcon: 'compass',
                inActiveIcon: 'compass-outline',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}