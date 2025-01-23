import { StyleSheet } from 'react-native';

export const roomtablestyles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(214, 214, 214, 0.78)',
    paddingVertical: 10,
  },
  button: {
    width: '80%',
  },
  tableheader: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  assetcolumn: {
    borderRightColor: '#ededed',
    borderRightWidth: 0.5,
    flex: 3,
  },
  assetheader: {
    borderRightColor: '#ededed',
    borderRightWidth: 0.5,
    flex: 3,
  },
  descheader: {
    flex: 7,
  },

  desccolumn: {
    flex: 7,
    marginLeft: 5,
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
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
