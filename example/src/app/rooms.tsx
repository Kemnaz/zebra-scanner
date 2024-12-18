import * as React from 'react';
import { List, Button, TextInput } from 'react-native-paper';
import TableComponent from '../components/rooms/table';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { areasFetch } from '../components/enpoints/endpointManager';
import { useContext } from 'react';
import { SettingsContext } from '../library/context/SettingsContext';

interface RoomData {
  location: string;
  scannedDate: string | null;
  count: number;
}

interface Pagination {
  size: number;
  totalPages: number;
  page: number;
  totalElements: number;
}

interface RoomDataResponse {
  content: RoomData[];
  pagination: Pagination;
}

const MyComponent = () => {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [rooms, setRooms] = React.useState<RoomData[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(0); // 0-based index
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const { urlPath } = useContext(SettingsContext);

  const handlePress = (location: string) => {
    setExpanded(expanded === location ? null : location);
  };

  async function getAreas(page: number, search: string = '') {
    try {
      const data: RoomDataResponse = await areasFetch(urlPath, page, search);
      if (data != null) {
        setRooms(data.content);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  }

  React.useEffect(() => {
    getAreas(currentPage, isSearching ? searchQuery : '');
  }, [currentPage, isSearching]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset to the first page (0-based index) for a new search
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setCurrentPage(0); // Clear search and reset to the first page
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      // Ensure page doesn't exceed totalPages (0-based)
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      // Prevent going below page 0 (0-based index)
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          label="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}>
          Search
        </Button>
        {isSearching && (
          <Button
            mode="outlined"
            onPress={handleClearSearch}
            style={styles.clearButton}>
            Clear
          </Button>
        )}
      </View>

      <List.Section title="Locations" style={styles.section}>
        {rooms.map((room, index) => (
          <List.Accordion
            key={`${room.location}-${room.scannedDate || index}`}
            title={room.location}
            expanded={expanded === room.location}
            onPress={() => handlePress(room.location)}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}>
            <TableComponent room={room.location} />
          </List.Accordion>
        ))}
      </List.Section>

      <View style={styles.paginationContainer}>
        <Button
          mode="outlined"
          onPress={handlePrevious}
          disabled={currentPage === 0} // Disabled when on the first page
          style={styles.button}>
          Previous
        </Button>
        <Text style={styles.pageInfo}>
          Page {currentPage + 1} of {totalPages}{' '}
          {/* Display current page as 1-based index */}
        </Text>
        <Button
          mode="outlined"
          onPress={handleNext}
          disabled={currentPage === totalPages - 1} // Disabled when on the last page
          style={styles.button}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  section: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  accordion: {
    backgroundColor: '#ffffff',
    marginBottom: 0,
    borderColor: '#c4c4c4',
    borderWidth: 0.5,
    elevation: 2,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 5,
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  searchButton: {
    marginRight: 5,
  },
  clearButton: {
    marginLeft: 5,
  },
});

export default MyComponent;
