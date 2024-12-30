import { StyleSheet } from "react-native";

const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'KCC-Hanbit',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row', // 입력 필드와 아이콘 가로 정렬
    alignItems: 'center', // 수직 중앙 정렬
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1, // 입력 필드가 남은 공간 차지
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordIconContainer: {
    padding: 5, // 아이콘 클릭 영역 확보
  },
});

export default LoginScreenStyles;
