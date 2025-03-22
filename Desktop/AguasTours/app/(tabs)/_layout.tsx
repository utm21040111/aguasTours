import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { StyleSheet, View, Text, Image } from "react-native"; // Added Image
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';


import EditScreenInfo from '@/components/EditScreenInfo';



// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'AguasTours',
          // Modified tabBarIcon
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/hogar.png')} // Adjust path if needed
              style={{
                width: size, // Use size prop
                height: size, // Use size prop
                tintColor: color, // Apply tintColor
                marginBottom: -3, // Keep the marginBottom
              }}
              resizeMode="contain" // Ensure proper scaling
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Image
                    source={require("../../assets/images/logo.png")} // Adjust path if needed
                    style={{
                      marginRight: 15,
                      opacity: pressed ? 0.5 : 1,
                      width: 25,
                      height: 25,
                      borderRadius: 12.5,
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Share',
          // Modified tabBarIcon for "two" tab (optional)
          tabBarIcon: ({ color, size }) => (
            <Image
              // source={require('../../assets/images/another_icon.png')} // Replace with your image
              source={require('../../assets/images/logo.png')} // Or use the same logo
              style={{
                width: size,
                height: size,
                tintColor: color,
                marginBottom: -3,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}