import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './config';
import { useFonts } from 'expo-font';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import AppStyles from './styles/AppStyles';

const App = ({ navigation }: any) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState('');
  const [soundUri, setSoundUri] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiToken, setApiToken] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    'KCC-Hanbit': require('../assets/font/KCC-Hanbit.ttf'),
  });

  useEffect(() => {
    const loadTokenAndCheckLoginStatus = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setIsLoggedIn(true);
        setApiToken(token);
      }
    };

    loadTokenAndCheckLoginStatus();

    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 부족', '앱 기능을 사용하려면 마이크 권한이 필요합니다.');
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={AppStyles.loadingContainer}>
        <Text style={AppStyles.loadingText}>폰트를 로딩 중...</Text>
      </View>
    );
  }

  const handleTextInputFocus = () => {
    if (!isLoggedIn) {
      Alert.alert('사용 불가', '로그인 후에 사용 가능합니다.');
    }
  };

  const handleTextInputChange = (value: string) => {
    if (isLoggedIn) {
      setText(value);
    }
  };

  const startRecording = async () => {
    try {
      setStatus('녹음 준비 중...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setStatus('녹음 중...');
    } catch (error) {
      console.error('녹음 실패:', error);
      setStatus('녹음 실패');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setStatus('녹음 종료 중...');
      await recording.stopAndUnloadAsync();
      setIsRecording(false);

      const uri = recording.getURI();
      if (uri) {
        console.log('녹음 파일 경로:', uri);
        await uploadAudio(uri);
        setStatus('녹음 완료 및 업로드 중...');
      } else {
        setStatus('녹음된 파일을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('녹음 종료 실패:', error);
      setStatus('녹음 종료 실패');
    } finally {
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const speakText = () => {
    if (text.trim()) {
      try {
        setStatus('텍스트 음성 변환 중...');
        Speech.speak(text, {
          onDone: () => {
            setStatus('텍스트 음성 변환 완료');
            setTimeout(() => setStatus(''), 2000);
          },
        });
      } catch (error) {
        console.error('음성 변환 중 오류 발생:', error);
        setStatus('텍스트 음성 변환 실패');
      }
    } else {
      Alert.alert('텍스트 없음', '읽을 텍스트를 입력해주세요.');
    }
  };

  const uploadAudio = async (uri: string) => {
    try {
      setStatus('파일 업로드 중...');
      const formData = new FormData();
  
      formData.append('audio', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav',
      } as unknown as Blob);
  
      const token = await AsyncStorage.getItem('access_token'); // 토큰을 가져오되 없어도 실행 가능
      const headers: any = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      };
  
      if (token) {
        headers.Authorization = `Bearer ${token}`; // 토큰이 있을 때만 Authorization 헤더 추가
      }
  
      const response = await fetch(`${config.API_BASE_URL}/api/audio`, {
        method: 'POST',
        headers,
        body: formData,
      });
  
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error(`API 요청 실패: ${response.status} - ${response.statusText}`);
        console.error('백엔드 응답:', errorResponse);
        Alert.alert('오류', `API 요청 실패: ${response.status} - ${errorResponse}`);
        return;
      }
  
      const data = await response.json();
      setText(data.text);
      setSoundUri(data.audioUrl);
      setStatus('파일 업로드 완료');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      setStatus('파일 업로드 실패');
    } finally {
      setTimeout(() => setStatus(''), 2000);
    }
  };  

  const playAudio = async () => {
    if (!soundUri) {
      Alert.alert('오디오 없음', '재생할 오디오 파일이 없습니다.');
      return;
    }

    try {
      setStatus('오디오 재생 중...');
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.error('오디오 재생 실패:', error);
      setStatus('오디오 재생 실패');
    } finally {
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const copyText = async () => {
    if (text.trim()) {
      try {
        await Clipboard.setStringAsync(text);
        Alert.alert('복사 완료', '텍스트가 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('텍스트 복사 실패:', error);
        Alert.alert('복사 실패', '텍스트를 복사하는 도중 오류가 발생했습니다.');
      }
    } else {
      Alert.alert('복사 실패', '복사할 텍스트가 없습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={AppStyles.container}>
          <TouchableOpacity style={AppStyles.menuButton}>
            <MaterialIcons name="menu" size={30} color="black" />
          </TouchableOpacity>

          <View style={AppStyles.textInputContainer}>
            <TextInput
              value={text}
              onChangeText={handleTextInputChange}
              placeholder="여기에 텍스트를 입력하세요"
              style={AppStyles.textInput}
              editable={isLoggedIn}
              multiline
              textAlignVertical="top"
              onFocus={handleTextInputFocus}
              onTouchStart={() => {
                if (!isLoggedIn) {
                  Alert.alert('사용 불가', '로그인 후에 사용 가능합니다.');
                }
              }}
            />

            <View style={AppStyles.actionButtons}>
              <TouchableOpacity
                style={[AppStyles.iconButton, AppStyles.speakerButton]}
                onPress={speakText}
              >
                <Feather name="volume-2" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[AppStyles.iconButton, AppStyles.copyButton]}
                onPress={copyText}
              >
                <Feather name="copy" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={AppStyles.recordingContainer}>
            <TouchableOpacity
              style={[
                AppStyles.recordingButton,
                isRecording && AppStyles.recordingButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <MaterialCommunityIcons
                name={isRecording ? 'microphone-off' : 'microphone'}
                size={80}
                color="white"
              />
            </TouchableOpacity>
            <Text style={AppStyles.status}>{status}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default App;
