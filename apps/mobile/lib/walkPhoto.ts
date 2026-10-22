// 산책 사진 선택 (촬영/앨범) — 기록 추가 시트와 산책 종료 화면 공용.
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };

export function pickWalkPhoto(current: string | null, onChange: (uri: string | null) => void): void {
  const take = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('카메라 권한이 필요해요', 'iPhone 설정 → 댕댕케어에서 카메라를 허용해주세요.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  };
  const choose = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  };
  Alert.alert('산책 사진', undefined, [
    { text: '사진 찍기', onPress: take },
    { text: '앨범에서 고르기', onPress: choose },
    ...(current ? [{ text: '사진 빼기', style: 'destructive' as const, onPress: () => onChange(null) }] : []),
    { text: '취소', style: 'cancel' },
  ]);
}
