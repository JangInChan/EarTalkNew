import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Linking, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { config } from '../config';
import SignUpScreenStyles from '../styles/SignUpScreenStyles';

const SignUpScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthYear, setBirthYear] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [isBirthYearModalVisible, setBirthYearModalVisible] = useState(false);
  const [isSexModalVisible, setSexModalVisible] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyPolicyAgreed, setIsPrivacyPolicyAgreed] = useState(false);

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  const sexOptions = ['남성', '여성'];

  const handleSignUp = async () => {
    if (!isTermsAgreed || !isPrivacyPolicyAgreed) {
      Alert.alert('약관 동의 필요', '회원가입을 진행하려면 모든 약관에 동의해야 합니다.');
      return;
    }

    if (password !== verifyPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 유효성 검증
    const passwordValidation = (password: string): string | null => {
      const minLength = 8;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (password.length < minLength) {
        return `비밀번호는 최소 ${minLength}자 이상이어야 합니다.`;
      }
      if (!hasSpecialChar) {
        return '비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.';
      }
      return null;
    };

    const passwordError = passwordValidation(password);
    if (passwordError) {
      Alert.alert('비밀번호 오류', passwordError);
      return;
    }

    type ErrorDetail = {
      loc: string[]; // 오류가 발생한 위치
      msg: string; // 서버에서 반환된 메시지
      ctx?: {
        [key: string]: any; // 추가적인 컨텍스트 정보 (선택적)
      };
    };

    const translateErrorMessage = (errorData: ErrorDetail[]): string => {
      return errorData
        .map((error) => {
          if (error.loc.includes("email")) {
            return "이메일 주소가 유효하지 않습니다. 이메일에는 @ 기호가 포함되어야 합니다.";
          }
          if (error.loc.includes("password")) {
            return "비밀번호는 최소 8자 이상이어야 하며, 특수문자를 포함해야 합니다.";
          }
          if (error.loc.includes("verify_password")) {
            return "비밀번호 확인은 비밀번호와 동일해야 합니다.";
          }
          if (error.loc.includes("birthyear")) {
            return "출생 연도를 올바르게 입력해야 합니다.";
          }
          return "알 수 없는 오류가 발생했습니다.";
        })
        .join("\n");
    };


    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          verify_password: verifyPassword,
          email,
          birthyear: birthYear,
          sex: sex === '남성' ? true : false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const translatedMessage = translateErrorMessage(errorData.detail);
        Alert.alert('회원가입 실패', translatedMessage);
        return;
      }

      Alert.alert('회원가입 성공', '계정이 생성되었습니다.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={SignUpScreenStyles.container}>
      {/* 개인정보처리방침 항상 상단에 표시 */}
      <View style={SignUpScreenStyles.privacyPolicyContainer}>
        <Text style={SignUpScreenStyles.privacyPolicyText} onPress={() => Linking.openURL('https://yulyul.notion.site/EarTalk-24-11-10-14b9d7c2ac5480ba8829f570332934ac?pvs=4')}>
          📜 개인정보처리방침 보기
        </Text>
      </View>

      <Text style={SignUpScreenStyles.title}>회원가입</Text>
      <TextInput
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
        style={SignUpScreenStyles.input}
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={SignUpScreenStyles.input}
      />
      <TextInput
        placeholder="비밀번호 확인"
        secureTextEntry
        value={verifyPassword}
        onChangeText={setVerifyPassword}
        style={SignUpScreenStyles.input}
      />
      <TextInput
        placeholder="이메일"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={SignUpScreenStyles.input}
      />

      {/* 출생 연도 선택 */}
      <TouchableOpacity
        onPress={() => setBirthYearModalVisible(true)}
        style={SignUpScreenStyles.selector}
      >
        <Text style={SignUpScreenStyles.selectorText}>{birthYear ? birthYear : '출생 연도 선택'}</Text>
      </TouchableOpacity>

      {/* 성별 선택 */}
      <TouchableOpacity
        onPress={() => setSexModalVisible(true)}
        style={SignUpScreenStyles.selector}
      >
        <Text style={SignUpScreenStyles.selectorText}>{sex ? sex : '성별 선택'}</Text>
      </TouchableOpacity>

      {/* 약관 동의 */}
      <View style={SignUpScreenStyles.termsContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://yulyul.notion.site/EarTalk-24-11-10-14b9d7c2ac5480f48b7af2d9cde26b88?pvs=4')}
        >
          <Text style={SignUpScreenStyles.termsText}>📄 서비스 이용약관 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsTermsAgreed(!isTermsAgreed)}
        >
          <Text style={SignUpScreenStyles.termsAgreeText}>
            {isTermsAgreed ? '✅ 동의 완료' : '☑ 동의하기'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://yulyul.notion.site/EarTalk-14b9d7c2ac548049bddfd035a7eb0c56?pvs=4')}
        >
          <Text style={SignUpScreenStyles.termsText}>📄 개인정보 수집 및 이용 동의 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsPrivacyPolicyAgreed(!isPrivacyPolicyAgreed)}
        >
          <Text style={SignUpScreenStyles.termsAgreeText}>
            {isPrivacyPolicyAgreed ? '✅ 동의 완료' : '☑ 동의하기'}
          </Text>
        </TouchableOpacity>
      </View>

      <Button title="회원가입" onPress={handleSignUp} />

      {/* 출생 연도 모달 */}
      <Modal
        visible={isBirthYearModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBirthYearModalVisible(false)}
      >
        <View style={SignUpScreenStyles.modalContainer}>
          <View style={SignUpScreenStyles.modalContent}>
            <FlatList
              data={birthYearOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setBirthYear(item);
                    setBirthYearModalVisible(false);
                  }}
                  style={SignUpScreenStyles.modalItem}
                >
                  <Text style={SignUpScreenStyles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="닫기" onPress={() => setBirthYearModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* 성별 모달 */}
      <Modal
        visible={isSexModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSexModalVisible(false)}
      >
        <View style={SignUpScreenStyles.modalContainer}>
          <View style={SignUpScreenStyles.modalContent}>
            {sexOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSex(option);
                  setSexModalVisible(false);
                }}
                style={SignUpScreenStyles.modalItem}
              >
                <Text style={SignUpScreenStyles.modalText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Button title="닫기" onPress={() => setSexModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignUpScreen;
