import { StyleSheet } from "react-native";

const MainScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontFamily: 'KCC-Hanbit',
    fontSize: 20,
    color: 'black',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'KCC-Hanbit',
    color: '#333',
  },
  headerButton: {
    padding: 10,
    backgroundColor: '#FFE400',
    borderRadius: 5,
    marginRight: 10,
  },
  headerButtonText: {
    fontFamily: 'KCC-Hanbit',
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFE400',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'KCC-Hanbit',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreenStyles;