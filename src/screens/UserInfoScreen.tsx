import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { config } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInfoScreenStyles from '../styles/UserInfoScreenStyles';

const UserInfoScreen = ({ navigation }: any) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('로그인 필요', '로그인 후에만 내 정보를 확인할 수 있습니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${config.API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더에 Bearer 토큰 추가
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      Alert.alert('오류', '사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={UserInfoScreenStyles.loader} />;
  }

  return (
    <View style={UserInfoScreenStyles.container}>
      {userInfo ? (
        <>
          <Text style={UserInfoScreenStyles.infoText}>이메일: {userInfo.email}</Text>
          <Text style={UserInfoScreenStyles.infoText}>출생년도: {userInfo.birthyear}</Text>
          <Text style={UserInfoScreenStyles.infoText}>성별: {userInfo.sex ? '남성' : '여성'}</Text>
          <Text style={UserInfoScreenStyles.infoText}>ID: {userInfo.id}</Text>
        </>
      ) : (
        <Text>사용자 정보를 불러오는 데 실패했습니다.</Text>
      )}
    </View>
  );
};

export default UserInfoScreen;
