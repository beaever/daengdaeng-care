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
  palette,
  safetyColors,
  verdictGradients,
  rnShadow,
  type ColorScheme,
} from '@daengdaeng/tokens';

export {
  space,
  radius,
  typography,
  fontFamily,
  layout,
  light,
  dark,
  palette,
  safetyColors,
  verdictGradients,
  rnShadow,
};

/** color scheme에 맞는 시맨틱 컬러 셋 반환 */
export function getColors(scheme: ColorScheme | null | undefined) {
  return scheme === 'dark' ? dark : light;
}

/** 기본(light) 컬러 — 다크모드 도입 전까지의 기본값 */
export const colors = light;

/**
 * Dynamic Type 확대 상한 — RN 0.86 Text는 함수 컴포넌트라 defaultProps로 전역 적용이 안 된다.
 * 고정 크기 상자 안 이모지/아이콘(icon)은 상자가 같이 커지지 않으니 확대를 막고,
 * 화면 제목급 큰 글자(heading)는 글자 단위 줄바꿈으로 화면을 절반 이상 차지하지 않도록 상한만 둔다.
 * 본문·라벨·버튼 텍스트는 접근성을 위해 그대로 둔다(상한 없음).
 */
export const fontScale = { icon: 1, heading: 1.5 } as const;
