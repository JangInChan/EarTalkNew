import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import { config } from '../config';
import * as FileSystem from 'expo-file-system';

// 파일 다운로드 및 오디오 재생
export const playStreamedAudio = async (identifier: string) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/file/${identifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('파일 다운로드 실패');
    }

    const localFileUri = `${FileSystem.documentDirectory}${identifier}.wav`;
    const downloadedFile = await FileSystem.downloadAsync(response.url, localFileUri);
    console.log('파일 다운로드 완료:', downloadedFile.uri);

    const { sound } = await Audio.Sound.createAsync(
      { uri: downloadedFile.uri },
      { shouldPlay: true }
    );
    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
        sound.unloadAsync();
      }
    });

    Alert.alert('오디오 재생', '오디오가 재생됩니다.');
  } catch (error) {
    console.error('오디오 재생 실패:', error);
    Alert.alert('오류', '오디오 재생 중 문제가 발생했습니다.');
  }
};
