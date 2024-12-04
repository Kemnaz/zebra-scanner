import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  dataTable: {
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  dataTableTitle: {
    fontWeight: "bold",
    color: "#333",
  },

  tableFooter: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    borderRadius: 0,
  },
  link: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  assetIdColumn: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  descriptionColumn: {
    flex: 6.5,
    justifyContent: "flex-start",
    margin: 5,
  },
  actionColumn: {
    flex: 1.5,
  },
});
