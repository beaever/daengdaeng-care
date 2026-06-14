// ============================================================
// DaengDaeng Care — Design Tokens (Single Source of Truth)
// All styles MUST reference these tokens. Never hardcode hex/values.
// ============================================================

export const palette = {
  brand: {
    50: '#FFF8EC',
    100: '#FEEFD0',
    200: '#FCDDA1',
    300: '#FAC768',
    400: '#F8B13C',
    500: '#F59E0B',
    600: '#DB8504',
    700: '#B56807',
    800: '#92520D',
    900: '#78440F',
  },
  safe: {
    base: '#16A34A',
    strong: '#15803D',
    soft: '#E7F6EC',
    softDark: '#14271A',
  },
  caution: {
    base: '#C98A05',
    strong: '#A26F04',
    soft: '#FBF1D4',
    softDark: '#2C2410',
  },
  danger: {
    base: '#E0413B',
    strong: '#C32D2D',
    soft: '#FCE9E7',
    softDark: '#301715',
  },
  info: {
    base: '#2D74E0',
    soft: '#E6EFFC',
    softDark: '#15233B',
  },
  stone: {
    0: '#FFFFFF',
    50: '#FFFDF9',
    100: '#FAF6EF',
    150: '#F4EFE6',
    200: '#ECE5D9',
    300: '#DBD2C2',
    400: '#B9AE9B',
    500: '#938A78',
    600: '#6B6354',
    700: '#4C4537',
    800: '#2E2A21',
    900: '#1C1913',
  },
} as const;

export const light = {
  bg: '#FFFDF9',
  surface: '#FFFFFF',
  surface2: '#FAF6EF',
  sunken: '#F4EFE6',
  border: '#ECE5D9',
  borderStrong: '#DBD2C2',
  text: '#1F1B13',
  text2: '#6B6354',
  text3: '#938A78',
  onBrand: '#FFFFFF',
  brand: '#F59E0B',
  brandPress: '#DB8504',
  brandSoft: '#FFF8EC',
  brandSoftBorder: '#FEEFD0',
  brandText: '#B56807',
  scrim: 'rgba(28, 25, 19, 0.45)',
  shadowSm: '0 1px 2px rgba(40,33,20,.05), 0 1px 1px rgba(40,33,20,.04)',
  shadowMd: '0 2px 6px rgba(40,33,20,.07), 0 1px 2px rgba(40,33,20,.05)',
  shadowLg: '0 8px 24px rgba(40,33,20,.12), 0 2px 6px rgba(40,33,20,.06)',
  shadowBrand: '0 6px 18px rgba(245,158,11,.32)',
} as const;

export const dark = {
  bg: '#14110B',
  surface: '#201B13',
  surface2: '#2A2419',
  sunken: '#1A150E',
  border: '#36301F',
  borderStrong: '#4A4230',
  text: '#F8F3E9',
  text2: '#BDB3A0',
  text3: '#877E6C',
  onBrand: '#2A1A03',
  brand: '#FBAE2B',
  brandPress: '#F59E0B',
  brandSoft: '#2E2410',
  brandSoftBorder: '#483814',
  brandText: '#FBC56A',
  scrim: 'rgba(0, 0, 0, 0.6)',
  shadowSm: '0 1px 2px rgba(0,0,0,.4)',
  shadowMd: '0 2px 8px rgba(0,0,0,.45)',
  shadowLg: '0 10px 28px rgba(0,0,0,.55)',
  shadowBrand: '0 6px 18px rgba(0,0,0,.5)',
} as const;

export type Theme = typeof light;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// Typography scale — SUIT font (fallback: Apple SD Gothic Neo, Pretendard)
export const type = {
  display: { size: 30, lineHeight: 1.22, weight: '800' as const, letterSpacing: -0.02 },
  h1:      { size: 24, lineHeight: 1.28, weight: '800' as const, letterSpacing: -0.02 },
  h2:      { size: 20, lineHeight: 1.32, weight: '700' as const, letterSpacing: -0.015 },
  title:   { size: 17, lineHeight: 1.40, weight: '700' as const, letterSpacing: -0.01 },
  callout: { size: 16, lineHeight: 1.50, weight: '600' as const },
  body:    { size: 15, lineHeight: 1.55, weight: '500' as const },
  sub:     { size: 14, lineHeight: 1.50, weight: '500' as const },
  caption: { size: 13, lineHeight: 1.45, weight: '500' as const },
  micro:   { size: 11, lineHeight: 1.30, weight: '700' as const, letterSpacing: 0.02 },
} as const;

export const layout = {
  tabbarHeight: 58,
  headerHeight: 52,
  adBannerHeight: 52,    // 50pt reserved — ALWAYS allocate this space
  minTouchTarget: 44,    // iOS minimum; Android 48dp
  pagePad: 20,
  cardPad: 18,
  rowPadH: 18,
  rowPadV: 16,
  sectionGap: 22,
} as const;

export const motion = {
  easeOut: 'cubic-bezier(.22,.61,.36,1)',
  easeSpring: 'cubic-bezier(.34,1.56,.64,1)',
  pressDuration: 120,
  pressScale: 0.97,
  pressScaleStrong: 0.92,
} as const;

export const fontFamily =
  "'SUIT', 'SUIT Variable', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard', system-ui, sans-serif";

// Safety semantic colors — NEVER mix with brand colors
export const safetyColors = {
  safe:      { base: palette.safe.base,      strong: palette.safe.strong,      soft: palette.safe.soft,      softDark: palette.safe.softDark },
  caution:   { base: palette.caution.base,   strong: palette.caution.strong,   soft: palette.caution.soft,   softDark: palette.caution.softDark },
  danger:    { base: palette.danger.base,    strong: palette.danger.strong,    soft: palette.danger.soft,    softDark: palette.danger.softDark },
  emergency: { base: '#EF4B43',              strong: '#B01F1F',                soft: palette.danger.soft,    softDark: palette.danger.softDark },
  today:     { base: palette.caution.base,   strong: palette.caution.strong,   soft: palette.caution.soft,   softDark: palette.caution.softDark },
  watch:     { base: palette.safe.base,      strong: palette.safe.strong,      soft: palette.safe.soft,      softDark: palette.safe.softDark },
} as const;

export type SafetyLevel = 'safe' | 'caution' | 'danger';
export type SeverityLevel = 'emergency' | 'today' | 'watch';
export type GradeLevel = 'A' | 'B' | 'C' | 'D';
export type ColorScheme = 'light' | 'dark';
