import { StyleSheet } from 'react-native';

const RecordingListScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
  emptyText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
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
    fontFamily: 'KoddiUDOnGothic-Bold',
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#007BFF',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  deleteAllButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteAllButtonText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#007BFF',
    marginVertical: 10,
  },
});

export default RecordingListScreenStyles;
