// 댕댕케어 — @daengdaeng/ui ESLint flat config (ESLint 9)
// ESLint 9는 flat config(eslint.config.js)만 지원한다. 구 .eslintrc + `--ext` 방식은 폐기됨.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  // 빌드 산출물·스토리북 정적 출력은 검사 제외
  { ignores: ['dist', 'storybook-static'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // 컴포넌트 라이브러리 핵심 — 훅 규칙은 error, 의존성 배열은 warn
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // Storybook 스토리는 소문자 `render` 함수 안에서 훅을 쓰는 게 정상 패턴이라
    // rules-of-hooks 오탐이 난다. 스토리에 한해 이 규칙만 끈다(TS 규칙은 유지).
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
);
