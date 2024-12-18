import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { SettingsContext } from '../library/context/SettingsContext';
import { useSettings } from '../library/hooks/useSettings';
import { TabBarIcon } from '../components/navigation/TabBarIcon';
import * as ExpoZebraScanner from 'expo-zebra-scanner';
import { PROFILE_NAME } from '../library/constants/datawedgeStructures';

export default function TabLayout() {
  const settings = useSettings();

  // We create the profile with custom decoders when app loads
  useEffect(() => {
    ExpoZebraScanner.createIntentDatawedgeProfile({
      PROFILE_NAME,
      PACKAGE_NAME: 'expo.modules.zebrascanner.example.preview',
      PARAM_LIST: {
        decoder_i2of5: 'true',
      },
    });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0a7ea4',
        }}>
        <Tabs.Screen
          name="rooms"
          options={{
            title: 'Rooms',
            headerTitle: 'AssetHouse',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'location' : 'location-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Test',
            headerTitle: 'AssetHouse',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'barcode' : 'barcode-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerTitle: 'Datawedge settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="[room]"
          options={{ tabBarItemStyle: { display: 'none' } }}
        />
      </Tabs>
    </SettingsContext.Provider>
  );
}
