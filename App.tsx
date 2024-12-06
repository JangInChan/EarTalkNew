import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import HomeScreen from './src/App';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import UpdatePasswordScreen from './src/screens/UpdatePasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import DeleteAccountScreen from './src/screens/DeleteAccountScreen';
import RecordingListScreen from './src/screens/RecordingListScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';
import MainScreenStyles from './src/styles/MainScreenStyles';

type StackParamList = {
  Home: undefined;
  SignUp: undefined;
  Login: undefined;
  UpdatePassword: undefined;
  UserInfo: undefined;
  ResetPassword: undefined;
  DeleteAccount: undefined;
  RecordingList: undefined;
  Menu: undefined;
};

// Stack Navigator 생성
const Stack = createStackNavigator<StackParamList>();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'KCC-Hanbit': require('./assets/font/KCC-Hanbit.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error('폰트 로딩 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={MainScreenStyles.container}>
        <Text style={MainScreenStyles.loadingText}>폰트를 로딩 중...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <Text style={MainScreenStyles.headerTitle}>EarTalk</Text>
            ),
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity
                style={MainScreenStyles.headerButton}
                onPress={() => navigation.navigate('Menu')}
              >
                <Text style={MainScreenStyles.headerButtonText}>메뉴</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: '회원가입' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} options={{ title: '비밀번호 변경' }} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: '내 정보' }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: '비밀번호 찾기' }} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: '회원탈퇴' }} />
        <Stack.Screen name="RecordingList" component={RecordingListScreen} options={{ title: '녹음 기록' }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: '메뉴' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// MenuScreen 타입 지정
type MenuScreenProps = {
  navigation: StackNavigationProp<StackParamList, 'Menu'>;
};

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      setIsLoggedIn(false);
      Alert.alert('로그아웃', '로그아웃 되었습니다.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('로그아웃 오류:', error);
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={MainScreenStyles.container}>
      {isLoggedIn ? (
        <>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('UserInfo')}
          >
            <Text style={MainScreenStyles.buttonText}>내 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('RecordingList')}
          >
            <Text style={MainScreenStyles.buttonText}>녹음 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('UpdatePassword')}
          >
            <Text style={MainScreenStyles.buttonText}>비밀번호 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('DeleteAccount')}
          >
            <Text style={MainScreenStyles.buttonText}>회원탈퇴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={MainScreenStyles.button} onPress={handleLogout}>
            <Text style={MainScreenStyles.buttonText}>로그아웃</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={MainScreenStyles.buttonText}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={MainScreenStyles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MainScreenStyles.button}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={MainScreenStyles.buttonText}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default App;
