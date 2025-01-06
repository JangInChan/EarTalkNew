import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config';
import RecordingListScreenStyles from '../styles/RecordingListScreenStyles';
import { playStreamedAudio } from './audioFunctions'; // playStreamedAudio 함수 import

const RecordingListScreen = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 녹음 기록 로드 함수
  const fetchRecordings = async () => {
    try {
      setLoading(true);

      // 로컬 저장소에서 녹음 기록을 가져옵니다.
      const recordingsData = await AsyncStorage.getItem('recordings');
      if (recordingsData) {
        setRecordings(JSON.parse(recordingsData));
      } else {
        setRecordings([]);
      }
    } catch (error) {
      console.error('녹음 기록 로드 실패:', error);
      Alert.alert('오류', '녹음 기록을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings(); // 컴포넌트가 마운트될 때 녹음 기록 로드
  }, []);

  // 녹음 삭제 함수
  const deleteRecording = async (id: string) => {
    const updatedRecordings = recordings.filter((recording: any) => recording.id !== id);
    setRecordings(updatedRecordings);

    try {
      // AsyncStorage에 업데이트된 녹음 기록을 저장
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      Alert.alert('삭제 완료', '녹음 기록이 삭제되었습니다.');
    } catch (error) {
      console.error('녹음 기록 삭제 실패:', error);
      Alert.alert('오류', '녹음 기록을 삭제하는 중 문제가 발생했습니다.');
    }
  };

  // 전체 삭제 함수
  const deleteAllRecordings = async () => {
    Alert.alert(
      '전체 삭제',
      '모든 녹음 기록을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            setRecordings([]);
            try {
              await AsyncStorage.setItem('recordings', JSON.stringify([])); // 전체 삭제 후 AsyncStorage 업데이트
              Alert.alert('삭제 완료', '모든 녹음 기록이 삭제되었습니다.');
            } catch (error) {
              console.error('전체 삭제 실패:', error);
              Alert.alert('오류', '모든 녹음 기록을 삭제하는 중 문제가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // 스타일링된 버튼 컴포넌트
  const CustomButton = ({ title, onPress, style }: { title: string; onPress: () => void; style?: object }) => (
    <TouchableOpacity onPress={onPress} style={[RecordingListScreenStyles.button, style]}>
      <Text style={RecordingListScreenStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderRecordingItem = ({ item }: { item: any }) => (
    <View style={RecordingListScreenStyles.recordingItem}>
      <Text style={RecordingListScreenStyles.recordingText}>ID: {item.id}</Text>
      <Text style={RecordingListScreenStyles.recordingText}>텍스트: {item.text}</Text>
      <CustomButton title="재생" onPress={() => playStreamedAudio(item.identifier)} style={RecordingListScreenStyles.playButton} />
      <CustomButton title="삭제" onPress={() => deleteRecording(item.id)} style={RecordingListScreenStyles.deleteButton} />
    </View>
  );

  return (
    <View style={RecordingListScreenStyles.container}>
      <CustomButton title="전체 삭제" onPress={deleteAllRecordings} style={RecordingListScreenStyles.deleteAllButton} />

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
