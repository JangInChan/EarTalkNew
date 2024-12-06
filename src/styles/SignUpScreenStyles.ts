import { StyleSheet } from "react-native";

const SignUpScreenStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  privacyPolicyContainer: { marginBottom: 10, alignItems: 'center' },
  privacyPolicyText: { fontSize: 14, color: 'blue', textDecorationLine: 'underline' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  selector: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, justifyContent: 'center' },
  selectorText: { fontSize: 16, color: 'gray' },
  termsContainer: { marginBottom: 15 },
  termsText: { color: 'blue', textDecorationLine: 'underline', marginBottom: 10 },
  termsAgreeText: { fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginHorizontal: 20, maxHeight: '70%' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  modalText: { fontSize: 16 },
});

export default SignUpScreenStyles;