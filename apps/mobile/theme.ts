// RN 테마 — packages/tokens(순수 TS 객체)를 React Native에서 그대로 재사용.
// 단일 출처 원칙: 색·간격·radius·타이포는 절대 하드코딩하지 말고 여기서 가져온다.
import {
  light,
  dark,
  space,
  radius,
  type as typography,
  fontFamily,
  layout,
  type ColorScheme,
} from '@daengdaeng/tokens';

export { space, radius, typography, fontFamily, layout, light, dark };

/** color scheme에 맞는 시맨틱 컬러 셋 반환 */
export function getColors(scheme: ColorScheme | null | undefined) {
  return scheme === 'dark' ? dark : light;
}

/** 기본(light) 컬러 — 다크모드 도입 전까지의 기본값 */
export const colors = light;
