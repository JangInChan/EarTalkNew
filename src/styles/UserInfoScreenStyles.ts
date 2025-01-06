import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const UserInfoScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#f9f9f9',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoText: {
    fontFamily: 'KoddiUDOnGothic-Bold',
    fontSize: width * 0.045,
    marginVertical: height * 0.01,
    color: '#333',
    textAlign: 'center',
  },
});

export default UserInfoScreenStyles;
