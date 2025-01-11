import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import { MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import AppStyles from "./styles/AppStyles";
import { config, getHeaders } from "./config";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState("");
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [streamedAudioUri, setStreamedAudioUri] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fontsLoaded] = useFonts({
    "KCC-Hanbit": require("../assets/font/KoddiUDOnGothic-Bold.ttf"),
  });

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 부족", "앱 기능을 사용하려면 마이크 권한이 필요합니다.");
      }
    };

    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("access_token");
      setIsLoggedIn(!!token); // 토큰 존재 여부로 로그인 상태 설정
    };

    checkPermissions();
    checkLoginStatus();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={AppStyles.loadingContainer}>
        <Text style={AppStyles.loadingText}>폰트를 로딩 중...</Text>
      </View>
    );
  }

  const handleLockedTextBoxPress = () => {
    if (!isLoggedIn) {
      Alert.alert("알림", "로그인 후에 텍스트 입력이 가능합니다.");
    }
  };

  const startRecording = async () => {
    try {
      setText("");
      setStatus("녹음 준비 중...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setStatus("녹음 중...");
    } catch (error) {
      console.error("녹음 실패:", error);
      setStatus("녹음 실패");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setStatus("녹음 종료 중...");
      await recording.stopAndUnloadAsync();
      setIsRecording(false);

      const uri = recording.getURI();
      if (uri) {
        console.log("녹음 파일 경로:", uri);
        setStatus("녹음 완료. 서버로 전송 중...");
        await sendAudioWithText(uri, text);
      } else {
        setStatus("녹음된 파일을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("녹음 종료 실패:", error);
      setStatus("녹음 종료 실패");
    }
  };

  const sendAudioWithText = async (audioUri: string, inputText: string) => {
    try {
      const headers = await getHeaders();
      const formData = new FormData();
      formData.append("audio", {
        uri: audioUri,
        name: "recording.wav",
        type: "audio/wav",
      } as any);
      formData.append("input_text", inputText);

      const response = await fetch(`${config.API_BASE_URL}/api/audio`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`오디오 및 텍스트 전송 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("POST /api/audio 응답:", data);

      setIdentifier(data.identifier);
      setText(data.text); // 서버에서 받은 텍스트를 업데이트
      setStatus("서버 전송 완료. 파일 데이터 요청 중...");
      await fetchFileData(data.identifier);
      await saveRecordingData(data); // 녹음 기록 저장
    } catch (error) {
      console.error("서버 전송 실패:", error);
      setStatus("서버 전송 실패");
      Alert.alert("오류", "서버로 오디오 및 텍스트 전송 중 오류가 발생했습니다.");
    }
  };

  const saveRecordingData = async (recordingData: any) => {
    if (!isLoggedIn) {
      console.log("비로그인 상태에서는 녹음 데이터를 저장하지 않습니다.");
      return;
    }

    try {
      const recordings = JSON.parse((await AsyncStorage.getItem("recordings")) || "[]");
      recordings.push(recordingData);
      await AsyncStorage.setItem("recordings", JSON.stringify(recordings));
      console.log("녹음 데이터 저장 완료:", recordingData);
    } catch (error) {
      console.error("녹음 데이터 저장 실패:", error);
    }
  };

  const fetchFileData = async (identifier: string) => {
    try {
      setStatus("파일 데이터 요청 중...");
      const response = await fetch(`${config.API_BASE_URL}/api/file/${identifier}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`파일 데이터 요청 실패: ${response.status}`);
      }

      const localFileUri = `${FileSystem.documentDirectory}${identifier}.wav`;

      const downloadedFile = await FileSystem.downloadAsync(response.url, localFileUri);
      console.log("파일 다운로드 완료:", downloadedFile.uri);

      setStreamedAudioUri(downloadedFile.uri);
      setStatus("파일 다운로드 완료");
    } catch (error) {
      console.error("파일 데이터 요청 실패:", error);
      setStatus("파일 데이터 요청 실패");
      Alert.alert("오류", "파일 데이터를 요청하거나 저장하는 중 문제가 발생했습니다.");
    }
  };

  const playStreamedAudio = async () => {
    if (!streamedAudioUri) {
      Alert.alert("오디오 없음", "재생할 오디오 파일이 없습니다.");
      return;
    }

    try {
      console.log("재생할 로컬 파일 경로:", streamedAudioUri);

      setStatus("오디오 재생 중...");
      const { sound } = await Audio.Sound.createAsync(
        { uri: streamedAudioUri },
        { shouldPlay: true }
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
          setStatus("오디오 재생 완료");
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("오디오 재생 실패:", error);
      setStatus("오디오 재생 실패");
      Alert.alert("오류", "오디오 재생 중 문제가 발생했습니다.");
    }
  };

  const copyText = async () => {
    if (text.trim()) {
      try {
        await Clipboard.setStringAsync(text);
        Alert.alert("복사 완료", "텍스트가 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("텍스트 복사 실패:", error);
        Alert.alert("복사 실패", "텍스트를 복사하는 도중 오류가 발생했습니다.");
      }
    } else {
      Alert.alert("복사 실패", "복사할 텍스트가 없습니다.");
    }
  };

  // TTS(Text-to-Speech) 실행
  const speakText = () => {
    if (text.trim()) {
      Speech.speak(text, {
        onDone: () => setStatus("TTS 재생 완료"),
        onError: () => {
          Alert.alert("오류", "TTS 재생 중 문제가 발생했습니다.");
          setStatus("TTS 재생 실패");
        },
      });
    } else {
      Alert.alert("오류", "TTS로 변환할 텍스트가 없습니다.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={AppStyles.container}>
          <View style={AppStyles.textInputContainer}>
            <TextInput
              value={text}
              onChangeText={isLoggedIn ? setText : undefined}
              placeholder="여기에 텍스트를 입력하세요"
              style={AppStyles.textInput}
              multiline
              textAlignVertical="top"
              editable={isLoggedIn}
              onTouchStart={!isLoggedIn ? handleLockedTextBoxPress : undefined}
            />
            <View style={AppStyles.actionButtons}>
              <TouchableOpacity style={AppStyles.iconButton} onPress={copyText}>
                <Feather name="copy" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={AppStyles.iconButton} onPress={playStreamedAudio}>
                <MaterialIcons name="play-arrow" size={24} color="black" />
              </TouchableOpacity>
              {isLoggedIn && (
                <TouchableOpacity style={AppStyles.iconButton} onPress={speakText}>
                  <FontAwesome name="volume-up" size={24} color="black" />
                </TouchableOpacity>
              )}
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
              <MaterialCommunityIcons name={isRecording ? "microphone-off" : "microphone"} size={80} color="white" />
            </TouchableOpacity>
            <Text style={AppStyles.status}>{status}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default App;
