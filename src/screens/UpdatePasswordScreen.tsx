import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { config } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdatePasswordScreenStyles from '../styles/UpdatePasswordScreenStyles';

const UpdatePasswordScreen = ({ navigation }: any) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');

  // 비밀번호 유효성 검사를 위한 함수
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !verifyNewPassword) {
      Alert.alert('오류', '모든 필드를 입력하세요.');
      return;
    }

    if (newPassword !== verifyNewPassword) {
      Alert.alert('오류', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        '오류',
        '비밀번호는 8자리 이상이어야 하며, 영어, 숫자 및 특수기호를 포함해야 합니다.'
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        Alert.alert('오류', '인증되지 않았습니다. 로그인 해주세요.');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/api/users/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 인증 토큰 추가
        },
        body: JSON.stringify({
          current_password: oldPassword,
          new_password: newPassword,
          verify_new_password: verifyNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('비밀번호 변경 실패:', data);
        Alert.alert('비밀번호 변경 실패', data.detail || '알 수 없는 오류가 발생했습니다.');
        return;
      }

      Alert.alert('비밀번호 변경 성공', '비밀번호가 성공적으로 변경되었습니다.');
      navigation.goBack(); // 성공 시 이전 화면으로 돌아가기
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      Alert.alert('오류', '비밀번호 변경 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={UpdatePasswordScreenStyles.container}>
      <Text style={UpdatePasswordScreenStyles.title}>비밀번호 변경</Text>
      <TextInput
        placeholder="현재 비밀번호"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
        style={UpdatePasswordScreenStyles.input}
      />
      <TextInput
        placeholder="새 비밀번호"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={UpdatePasswordScreenStyles.input}
      />
      <TextInput
        placeholder="새 비밀번호 확인"
        secureTextEntry
        value={verifyNewPassword}
        onChangeText={setVerifyNewPassword}
        style={UpdatePasswordScreenStyles.input}
      />
      <Button title="비밀번호 변경" onPress={handlePasswordChange} />
    </View>
  );
};

export default UpdatePasswordScreen;
