import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const MainScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: width * 0.05,
  },

  loadingText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    fontSize: width * 0.05,
    color: 'black',
    textAlign: 'center',
    marginVertical: height * 0.02,
  },

  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    fontFamily: 'KoddiUDOnGothic-Bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: height * 0.01,
  },

  headerButton: {
    padding: width * 0.03,
    backgroundColor: '#FFE400',
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
  },

  headerButtonText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },

  button: {
    backgroundColor: '#FFE400',
    padding: height * 0.02,
    borderRadius: width * 0.02,
    marginVertical: height * 0.02,
    width: '80%',
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },

  textGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: height * 0.02,
  },

  textItem: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    fontSize: width * 0.04,
    color: '#333',
    textAlign: 'center',
  },
});

export default MainScreenStyles;
