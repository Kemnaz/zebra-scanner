import * as React from 'react';
import {
  DefaultTheme,
  DataTable,
  PaperProvider,
  Button,
} from 'react-native-paper';
import { tableFetch } from '../enpoints/endpointManager';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './tablestyles';
import { useContext } from 'react';
import { SettingsContext } from '@/src/library/context/SettingsContext';

interface TableComponentProps {
  room: string;
}

interface Asset {
  assetId: string;
  description: string;
  inventoryStatus: string;
}

interface RoomData {
  location: string;
  assetCount: number;
  assets: Asset[];
}

interface RoomDataResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: RoomData[];
}

const TableComponent: React.FC<TableComponentProps> = ({ room }) => {
  const router = useRouter();
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 15, 20, 30]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0],
  );
  const [items, setItems] = React.useState<Asset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { urlPath } = useContext(SettingsContext);
  async function updateAssets() {
    setLoading(true);
    try {
      const data: RoomDataResponse = await tableFetch(urlPath, room);
      if (data != null) {
        const roomData = data.content.find(r => r.location === room);
        if (roomData) {
          setItems(roomData.assets);
        }
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    updateAssets();
  }, [room]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const theme = {
    ...DefaultTheme,
  };

  // Funkcja określająca styl wiersza na podstawie inventoryStatus
  const getRowStyle = (status: string) => {
    switch (status) {
      case 'MISSING':
        return { backgroundColor: '#d61e2d' };
      case 'OK':
        return { backgroundColor: 'green' };
      case 'NEW':
        return { backgroundColor: 'yellow' };
      default:
        return { backgroundColor: 'white' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        <PaperProvider theme={theme}>
          <DataTable style={styles.dataTable}>
            {items.slice(from, to).map(item => (
              <DataTable.Row
                key={item.assetId}
                style={getRowStyle(item.inventoryStatus)}>
                <DataTable.Cell style={styles.assetIdColumn}>
                  {item.assetId}
                </DataTable.Cell>
                <DataTable.Cell style={styles.descriptionColumn}>
                  {item.description}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <View style={styles.tableFooter}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() =>
                router.push({
                  pathname: '[room]',
                  params: { room: room },
                })
              }>
              Enter
            </Button>
          </View>
        </PaperProvider>
      </ScrollView>
    );
  }
};

export default TableComponent;
