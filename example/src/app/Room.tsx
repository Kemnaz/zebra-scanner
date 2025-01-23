import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  DataTable,
  Button,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as ExpoZebraScanner from 'expo-zebra-scanner';
import { insideLocationFetch } from '../components/enpoints/endpointManager';
import { roomtablestyles } from './roomtablestyles';
import { SettingsContext } from '../library/context/SettingsContext';

type RouteParams = { room: string };

interface Asset {
  assetId: string;
  description: string;
  inventoryStatus: string;
  comment: string;
}

interface RoomData {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Asset[];
}

export default function RoomComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const location = decodeURIComponent(route.params.room);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [scannedAssets, setScannedAssets] = useState<Set<string>>(new Set());
  const user = 'user1';

  const { urlPath } = useContext(SettingsContext);

  useEffect(() => {
    getAssets();
  }, [location, urlPath]);

  useEffect(() => {
    const listener = ExpoZebraScanner.addListener(event => {
      const { scanData } = event;

      setAssets(prevAssets => {
        const existingAsset = prevAssets.find(
          asset => asset.assetId === scanData,
        );

        if (!existingAsset) {
          // Add new asset with "NEW" status
          return [
            ...prevAssets,
            {
              assetId: scanData,
              description: '',
              inventoryStatus: 'NEW',
              comment: '',
            },
          ];
        } else if (
          existingAsset.inventoryStatus !== 'NEW' &&
          existingAsset.inventoryStatus !== 'OK'
        ) {
          // Update status to "OK" only if it's not "NEW" or "OK"
          return prevAssets.map(asset =>
            asset.assetId === scanData
              ? { ...asset, inventoryStatus: 'OK' }
              : asset,
          );
        }

        return prevAssets;
      });

      setScannedAssets(prev => new Set(prev.add(scanData)));
    });

    ExpoZebraScanner.startScan();

    return () => {
      ExpoZebraScanner.stopScan();
      listener.remove();
    };
  }, [assets]);

  async function getAssets() {
    setIsLoading(true);
    const data: RoomData = await insideLocationFetch(urlPath, location);
    if (data) {
      setAssets(data.content);
    }
    setIsLoading(false);
  }

  async function onSaveClick() {
    const payload = {
      location,
      user,
      assets: assets.map(({ assetId, inventoryStatus, comment }) => {
        let status = inventoryStatus;

        if (
          !scannedAssets.has(assetId) &&
          !['NEW', 'OK'].includes(inventoryStatus)
        ) {
          // Assign "MISSING" status only if it has no status and was not scanned
          status = 'MISSING';
        }

        return {
          assetId,
          status,
          comment: comment || '',
        };
      }),
    };

    try {
      const response = await fetch(`${urlPath}/api/mobile/updateOutcome`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save successful:', result);

      // Refresh assets data after saving
      await getAssets();
    } catch (error) {
      console.error('Save failed:', error);
      await getAssets();
    }
  }

  function getRowColor(status: string) {
    switch (status) {
      case 'OK':
        return { backgroundColor: '#8be6a0' };
      case 'NEW':
        return { backgroundColor: '#f7e08d' };
      case 'MISSING':
        return { backgroundColor: '#ff5252' };
      default:
        return { backgroundColor: '#B3D9FF' };
    }
  }

  const theme = {
    ...DefaultTheme,
  };

  const deleteBtn = {
    backgroundColor: '#982B1C',
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator></ActivityIndicator>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  // function markAsMissing(assetId: string) {
  //   setAssets(prevAssets =>
  //     prevAssets.map(asset => {
  //       if (
  //         asset.assetId === assetId &&
  //         !['NEW', 'OK'].includes(asset.inventoryStatus)
  //       ) {
  //         return { ...asset, inventoryStatus: 'MISSING' };
  //       }
  //       return asset;
  //     }),
  //   );
  //   setScannedAssets(prev => {
  //     const newSet = new Set(prev);
  //     newSet.delete(assetId);
  //     return newSet;
  //   });
  // }

  return (
    <View style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={roomtablestyles.label}>
            <Text style={roomtablestyles.title}>Selected room: {location}</Text>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={roomtablestyles.assetcolumn}>
                Asset ID
              </DataTable.Title>
              <DataTable.Title style={roomtablestyles.desccolumn}>
                Description
              </DataTable.Title>
              {/* <DataTable.Title style={roomtablestyles.column}>
                Actions
              </DataTable.Title> */}
            </DataTable.Header>
            {isLoading ? (
              <SafeAreaView style={roomtablestyles.loadingContainer}>
                <ActivityIndicator></ActivityIndicator>
                <Text style={roomtablestyles.title}>Loading...</Text>
              </SafeAreaView>
            ) : (
              assets.map(item => (
                <DataTable.Row
                  key={item.assetId}
                  style={getRowColor(item.inventoryStatus)}>
                  <DataTable.Cell style={roomtablestyles.assetcolumn}>
                    <Text> {item.assetId}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={roomtablestyles.desccolumn}>
                    <Text numberOfLines={2} ellipsizeMode="tail">
                      {item.description}
                    </Text>
                  </DataTable.Cell>
                  {/* <DataTable.Cell style={roomtablestyles.column}>
                  <Pressable
                    style={deleteBtn}
                    onPress={() => markAsMissing(item.assetId)}>
                    <Text style={{ color: '#FEFEFE' }}>MISS</Text>
                  </Pressable>
                </DataTable.Cell> */}
                </DataTable.Row>
              ))
            )}
          </DataTable>
        </ScrollView>

        <View style={roomtablestyles.footer}>
          <Button
            style={roomtablestyles.button}
            mode="contained"
            onPress={onSaveClick}>
            SAVE
          </Button>
        </View>
      </PaperProvider>
    </View>
  );
}
