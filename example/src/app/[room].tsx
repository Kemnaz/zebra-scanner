import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
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
import { URLPATH } from '../library/constants/URL';

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
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const location = decodeURIComponent(route.params.room);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [scannedAssets, setScannedAssets] = useState<Set<string>>(new Set());
  const [newAssets, setNewAssets] = useState<Set<string>>(new Set());
  const user = 'user1';
  useEffect(() => {
    getAssets();
  }, [location]);

  useEffect(() => {
    const listener = ExpoZebraScanner.addListener(event => {
      const { scanData } = event;

      // If asset isn't already in the current assets list, treat it as NEW
      if (!assets.find(asset => asset.assetId === scanData)) {
        setNewAssets(prev => new Set(prev.add(scanData)));
        setAssets(prevAssets => [
          ...prevAssets,
          {
            assetId: scanData,
            description: 'New Asset', // You can add custom description logic here
            inventoryStatus: 'NEW',
            comment: '',
          },
        ]);
      } else {
        setScannedAssets(prev => new Set(prev.add(scanData)));
        setAssets(prevAssets =>
          prevAssets.map(asset =>
            asset.assetId === scanData
              ? { ...asset, inventoryStatus: 'OK' }
              : asset,
          ),
        );
      }
    });

    ExpoZebraScanner.startScan();

    return () => {
      ExpoZebraScanner.stopScan();
      listener.remove();
    };
  }, [assets]);

  async function getAssets() {
    const data: RoomData = await insideLocationFetch(location);
    if (data) {
      setAssets(data.content);
    }
  }

  async function onSaveClick() {
    const payload = {
      location,
      user,
      assets: assets.map(({ assetId, inventoryStatus, comment }) => {
        // Prevent modification of NEW items
        const status = newAssets.has(assetId)
          ? 'NEW'
          : scannedAssets.has(assetId)
            ? 'OK'
            : inventoryStatus === 'OK'
              ? 'OK'
              : 'MISSING'; // Default to MISSING if it was not scanned

        return {
          assetId,
          status,
          comment: comment || '',
        };
      }),
    };

    try {
      const response = await fetch(`${URLPATH}/api/mobile/updateOutcome`, {
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
      // console.error('Save failed:', error);
      await getAssets();
    }
  }

  function getRowColor(status: string) {
    switch (status) {
      case 'OK':
        return { backgroundColor: '#8be6a0' };
      case 'NEW':
        return { backgroundColor: '#f7e08d' }; // A yellowish color for NEW items
      case 'MISSING':
        return { backgroundColor: '#ec7d87' };
      default:
        return {};
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

  function markAsMissing(assetId: string) {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.assetId === assetId
          ? { ...asset, inventoryStatus: 'MISSING' }
          : asset,
      ),
    );
    setScannedAssets(prev => {
      const newSet = new Set(prev);
      newSet.delete(assetId);
      return newSet;
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={roomtablestyles.label}>
            <Text>Selected room: {location}</Text>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={roomtablestyles.column}>
                Asset ID
              </DataTable.Title>
              <DataTable.Title style={roomtablestyles.column}>
                Description
              </DataTable.Title>
              {/* <DataTable.Title style={roomtablestyles.column}>
                Status
              </DataTable.Title> */}
              <DataTable.Title style={roomtablestyles.column}>
                Actions
              </DataTable.Title>
            </DataTable.Header>

            {assets.map(item => (
              <DataTable.Row
                key={item.assetId}
                style={getRowColor(item.inventoryStatus)}>
                <DataTable.Cell style={roomtablestyles.column}>
                  {item.assetId}
                </DataTable.Cell>
                <DataTable.Cell style={roomtablestyles.column} numeric>
                  {item.description}
                </DataTable.Cell>
                {/* <DataTable.Cell style={roomtablestyles.column} numeric>
                  {item.inventoryStatus}
                </DataTable.Cell> */}
                <DataTable.Cell style={roomtablestyles.column}>
                  <Pressable
                    style={deleteBtn}
                    onPress={() => markAsMissing(item.assetId)}>
                    <Text style={{ color: '#FEFEFE' }}>MISS</Text>
                  </Pressable>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
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
