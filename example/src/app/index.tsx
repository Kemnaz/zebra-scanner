import React, { useCallback, useContext, useRef, useState } from 'react';
import * as ExpoZebraScanner from 'expo-zebra-scanner';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SettingsContext } from '../library/context/SettingsContext';

export default function HomeScreen() {
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [inputData, setInputData] = useState<string>('');
  const ref = useRef<TextInput>(null);
  const { isIntentEnabled } = useContext(SettingsContext);

  useFocusEffect(
    useCallback(() => {
      const listener = ExpoZebraScanner.addListener(event => {
        const { scanData } = event;
        setBarcodes(_barcodes => {
          // Only add if the scanned barcode is not already in the list
          if (!_barcodes.includes(scanData)) {
            return [..._barcodes, scanData];
          }
          return _barcodes; // Return unchanged if duplicate
        });
      });

      ExpoZebraScanner.startScan();
      ref?.current?.focus();

      return () => {
        ExpoZebraScanner.stopScan();
        listener.remove();
      };
    }, []),
  );

  return (
    <FlatList
      focusable={false}
      data={barcodes}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          {!isIntentEnabled && (
            <TextInput
              autoFocus
              ref={ref}
              style={styles.input}
              placeholder="Add barcode"
              focusable={true}
              value={inputData}
              onChangeText={setInputData}
              onSubmitEditing={() => {
                setBarcodes(_barcodes => {
                  // Only add if the input data is not already in the list
                  if (!_barcodes.includes(inputData)) {
                    return [..._barcodes, inputData];
                  }
                  return _barcodes;
                });
                setInputData('');
              }}
              blurOnSubmit={false}
            />
          )}
          <View style={styles.flex}>
            <Text>Barcodes ({barcodes.length})</Text>
            {isIntentEnabled && (
              <Text style={styles.helpLabel}>Intent enabled</Text>
            )}
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>Scanned barcodes will be shown here</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={styles.scannedItem}>
          <Text style={styles.barcode}>{item}</Text>
          <Pressable
            style={styles.deleteBtn}
            focusable={false}
            onPress={() =>
              setBarcodes(_barcodes =>
                _barcodes.filter((_, _index) => _index !== index),
              )
            }>
            <Text style={styles.deleteBtnLabel}>Delete</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  input: {
    backgroundColor: '#FEFEFE',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#D4D4D4',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEFEFE',
    marginHorizontal: 10,
    elevation: 4,
    paddingVertical: 30,
    marginBottom: 10,
  },
  scannedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    elevation: 4,
    backgroundColor: '#FEFEFE',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  barcode: {
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: '#982B1C',
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnLabel: {
    color: '#FEFEFE',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpLabel: {
    color: '#FF4233',
  },
});
