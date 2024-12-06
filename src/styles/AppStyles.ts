import { StyleSheet } from "react-native";

const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  textInputContainer: {
    flex: 6,
    backgroundColor: '#E7E7E7',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    padding: 10,
    color: '#000',
    fontSize: 16,
    fontFamily: 'KCC-Hanbit',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#DDD',
  },
  recordingContainer: {
    flex: 4,
    backgroundColor: '#FFE400',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  recordingButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE400',
    borderRadius: 50,
    width: 80,
    height: 80,
  },
  recordingButtonActive: {
    backgroundColor: '#FF6347',
  },
  status: {
    fontSize: 16,
    marginTop: 10,
    color: 'gray',
    fontFamily: 'KCC-Hanbit',
  },
});

export default AppStyles;
