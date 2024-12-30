import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config';
import LoginScreenStyles from '../styles/LoginScreenStyles';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>(''); // 이메일 상태 변수
  const [password, setPassword] = useState<string>(''); // 비밀번호 상태 변수
  const [showPassword, setShowPassword] = useState<boolean>(false); // 비밀번호 보기 상태 변수

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력하세요.');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', email);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', 'string');
    formData.append('client_secret', 'string');

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
        if (data.detail === 'Incorrect username or password') {
          Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
        } else if (data.detail === 'User not found') {
          Alert.alert('로그인 실패', '존재하지 않는 사용자입니다.');
        } else {
          Alert.alert('로그인 실패', '로그인 중 문제가 발생했습니다.');
        }
        return;
      }

      const token = data.access_token;
      console.log('발급된 토큰:', token);

      await AsyncStorage.setItem('access_token', token);

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
      <View style={LoginScreenStyles.passwordContainer}>
        <TextInput
          placeholder="비밀번호"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={LoginScreenStyles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={LoginScreenStyles.passwordIconContainer}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
