import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config';
import RecordingListScreenStyles from '../styles/RecordingListScreenStyles';

const RecordingListScreen = () => {
  const [recordings, setRecordings] = useState([]); // 녹음 기록 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 녹음 기록 로드 함수
  const fetchRecordings = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('access_token');
      console.log('토큰 확인:', token);

      if (!token) {
        Alert.alert('로그인 필요', '로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/api/users/me/audios`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전달
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 요청 실패:', errorText);
        Alert.alert('오류', `녹음 기록을 불러올 수 없습니다: ${response.statusText}`);
        setRecordings([]);
        return;
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data);

      if (data.count > 0) {
        setRecordings(data.data);
      } else {
        setRecordings([]);
        Alert.alert('정보', '녹음 기록이 없습니다.');
      }
    } catch (error) {
      console.error('녹음 기록 로드 실패:', error);
      Alert.alert('오류', '녹음 기록을 불러오는 중 문제가 발생했습니다.');
      setRecordings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings(); // 컴포넌트가 마운트될 때 녹음 기록 로드
  }, []);

  const renderRecordingItem = ({ item }: { item: any }) => (
    <View style={RecordingListScreenStyles.recordingItem}>
      <Text style={RecordingListScreenStyles.recordingText}>ID: {item.id}</Text>
      <Text style={RecordingListScreenStyles.recordingText}>텍스트: {item.text}</Text>
    </View>
  );

  return (
    <View style={RecordingListScreenStyles.container}>
      {loading ? (
        <Text style={RecordingListScreenStyles.loadingText}>로딩 중...</Text>
      ) : recordings.length > 0 ? (
        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecordingItem}
        />
      ) : (
        <Text style={RecordingListScreenStyles.emptyText}>녹음 기록이 없습니다.</Text>
      )}
    </View>
  );
};

export default RecordingListScreen;
