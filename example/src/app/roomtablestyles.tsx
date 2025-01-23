import { StyleSheet } from 'react-native';

export const roomtablestyles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    width: '80%',
  },
  assetcolumn: {
    borderRightColor: '#ededed',
    borderRightWidth: 0.5,

    flex: 3,
  },
  desccolumn: {
    flex: 7,
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    margin: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteBtn: {
    backgroundColor: '#982B1C',
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
