import { URLPATH } from '@/src/library/constants/URL';

export const areasFetch = async (urlPath: string, page = 0, search: any) => {
  let result = null;
  try {
    const response = await fetch(
      `${urlPath}/api/dashboard/listLocationsWithAssets?location=${search}&page=${page}&size=5&sort=location`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('areasFetch response was not ok');
    }

    result = await response.json();
  } catch (err) {
    console.error('areasFetch error:', err);
  }

  return result;
};

export const tableFetch = async (urlPath: string, room: string) => {
  let result;
  console.log(room);
  try {
    const response = await fetch(
      `${urlPath}/api/locations/locationsToRoomsPage?searchLocation=${room}&page=0&size=1`,
      {
        method: 'GET',
      },
    );

    result = await response.json();
    console.log('result');
    console.log(result);
  } catch (err) {
    console.error('tableFetch error:', err);
  }
  return result;
};

export const insideLocationFetch = async (
  urlPath: string,
  location: string,
) => {
  let result;
  try {
    const response = await fetch(
      `${urlPath}/api/locations/insideLocation?location=${location}&page=0&size=1000&sort=inventoryStatus`,
      {
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new Error('insideLocationFetch fetch response was not ok');
    }
    result = await response.json();
    console.log('result');
    console.log(result);
  } catch (err) {
    console.error('insideLocationFetch error:', err);
  }
  return result;
};
