import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 임포트

const TutorialScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "앱 시작하기",
      description: "앱을 시작하면, 텍스트 입력창과 여러 기능이 나타납니다. 먼저 텍스트를 입력해 주세요. 단 로그인하지 않은 사용자는 텍스트 입력은 제한됩니다.",
      icon: null,
    },
    {
      title: "녹음 시작",
      description: "녹음 버튼을 눌러 음성을 녹음할 수 있습니다. 녹음 중에는 상태가 바뀝니다.",
      icon: <Feather name="mic" size={40} color="black" />,
    },
    {
      title: "텍스트 복사",
      description: "입력한 텍스트는 클립보드로 복사할 수 있습니다. 복사 버튼을 눌러 확인해 보세요.",
      icon: <Feather name="copy" size={40} color="black" />,
    },
    {
      title: "오디오 재생",
      description: "녹음된 오디오는 'Play' 버튼을 눌러 사용자의 음성으로 재생할 수 있습니다. 단 녹음을 하였을때만 사용 가능합니다.",
      icon: <MaterialIcons name="play-arrow" size={40} color="black" />,
    },
    {
      title: "텍스트 음성 변환",
      description: "텍스트는 'Volume Up' 아이콘을 눌러 인공지능 음성으로 변환할 수 있습니다.",
      icon: <FontAwesome name="volume-up" size={40} color="black" />,
    },
    {
      title: "튜토리얼 완료",
      description: "이제 앱을 자유롭게 사용하실 수 있습니다. 시작 버튼을 눌러 홈 화면으로 돌아가세요.",
      icon: null,
    },
  ];

  // 튜토리얼 완료 여부를 AsyncStorage에 저장
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 튜토리얼 완료 후 홈 화면으로 이동
      await AsyncStorage.setItem("hasCompletedTutorial", "true");
      navigation.navigate("Home");
    }
  };

  // 앱이 처음 실행될 때 튜토리얼을 이미 봤는지 확인
  useEffect(() => {
    const checkTutorialStatus = async () => {
      const hasCompletedTutorial = await AsyncStorage.getItem("hasCompletedTutorial");
      if (hasCompletedTutorial === "true") {
        // 튜토리얼을 이미 본 경우, 바로 홈 화면으로 이동
        navigation.navigate("Home");
      }
    };
    checkTutorialStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{steps[currentStep].title}</Text>
      <Text style={styles.description}>{steps[currentStep].description}</Text>

      {/* 아이콘이 있을 때만 보여줌 */}
      {steps[currentStep].icon && (
        <View style={styles.iconContainer}>{steps[currentStep].icon}</View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentStep < steps.length - 1 ? "다음" : "시작"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontFamily: "KoddiUDOnGothic-Bold",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontFamily: "KoddiUDOnGothic-Bold",
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: "#FFE400",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#333",
    fontFamily: "KoddiUDOnGothic-Bold",
    fontSize: 18,
  },
});

export default TutorialScreen;
