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
    backgroundColor: '#f9f9f9',
  },
  recordingText: {
    fontFamily: 'KCC-Hanbit',
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  playButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  playButtonText: {
    fontFamily: 'KCC-Hanbit',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    fontFamily: 'KCC-Hanbit',
    textAlign: 'center',
    fontSize: 14,
    color: '#007BFF',
    marginVertical: 10,
  },
});

export default RecordingListScreenStyles;
