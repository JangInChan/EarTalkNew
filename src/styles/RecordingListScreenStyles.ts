import { StyleSheet } from "react-native";

const RecordingListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontFamily: 'KCC-Hanbit',
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
  emptyText: {
    fontFamily: 'KCC-Hanbit',
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  recordingItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  recordingText: {
    fontFamily: 'KCC-Hanbit',
    fontSize: 14,
    marginVertical: 2,
  },
});

export default RecordingListScreenStyles;