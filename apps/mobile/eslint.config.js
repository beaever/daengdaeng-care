// 댕댕케어 — @daengdaeng/mobile ESLint flat config (ESLint 9 / Expo SDK 52)
// ESLint 9는 flat config만 지원한다. `expo lint`가 첫 실행 시 자동 생성하던 설정을
// 명시적으로 커밋해 모노레포 lint 자세를 일관되게 유지한다.
// 참고: https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    // Expo 빌드 산출물·번들 캐시는 검사 제외
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
];
