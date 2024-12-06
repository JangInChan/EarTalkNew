import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from '../config';
import LoginScreenStyles from '../styles/LoginScreenStyles';

const LoginScreen = ({ navigation }: any) => {
  // email과 password의 상태를 string으로 선언
  const [email, setEmail] = useState<string>('');  // TypeScript로 email 상태 변수 선언
  const [password, setPassword] = useState<string>('');  // TypeScript로 password 상태 변수 선언

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력하세요.');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', email);  // email을 username으로 사용
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', 'string');  // 실제 client_id 사용
    formData.append('client_secret', 'string');  // 실제 client_secret 사용

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/login/access-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        Alert.alert('로그인 실패', data.detail || '서버 오류');
        return;
      }
  
      const token = data.access_token;
      console.log('발급된 토큰:', token);
  
      // AsyncStorage에 토큰 저장
      await AsyncStorage.setItem('access_token', token);
  
      // 저장된 토큰 확인
      const savedToken = await AsyncStorage.getItem('access_token');
      console.log('저장된 토큰 확인:', savedToken);
  
      Alert.alert('로그인 성공', '로그인에 성공했습니다!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={LoginScreenStyles.container}>
      <Text style={LoginScreenStyles.title}>로그인</Text>
      <TextInput
        placeholder="이메일"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={LoginScreenStyles.input}
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={LoginScreenStyles.input}
      />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
