// Jest 설정 — jest-expo 프리셋을 기반으로 두 가지만 보정한다.
//
// 1) JS/TS 변환 프리셋 교체
//    babel-preset-expo@57.0.13 내장 flow 설정(configs/flow.js)은
//    `babel-plugin-syntax-hermes-parser`를 등록하지 않아 react-native 0.86.3 소스의
//    최신 Flow 문법(예: 제네릭 `const T extends {...}`)을 파싱하지 못한다.
//    Metro는 자체적으로 hermes-parser로 선(先)-파싱하므로 실제 앱 번들링에는 영향이 없지만,
//    babel-jest는 이 프리셋만으로 소스를 직접 파싱하기 때문에 실패한다.
//    hermes-parser를 포함하는 `@react-native/babel-preset`으로 교체해 우회한다.
// 2) 워크스페이스 패키지 매핑
//    @daengdaeng/constants, @daengdaeng/tokens 의 package.json "exports"에는
//    "require" 조건이 없어 Jest(CJS 해석)가 모듈을 찾지 못한다. dist 파일로 직접 매핑한다.
const preset = require('jest-expo/jest-preset');

const babelJestKey = Object.keys(preset.transform).find((key) => key.includes('[jt]sx?'));
preset.transform[babelJestKey] = [
  'babel-jest',
  { babelrc: false, configFile: false, presets: ['module:@react-native/babel-preset'] },
];

// 3) EXPO_OS 인라인 유실 보정 (위 1번 교체의 부작용)
//    자세한 설명은 jest.setupEnv.js 참고. 다른 setupFiles(특히 jest-expo 자체 setup.js)보다
//    먼저 실행되어야 하므로 배열 맨 앞에 넣는다.
preset.setupFiles = [require.resolve('./jest.setupEnv.js'), ...(preset.setupFiles ?? [])];

preset.moduleNameMapper = {
  ...preset.moduleNameMapper,
  '^@daengdaeng/constants$': '<rootDir>/../../packages/constants/dist/index.js',
  '^@daengdaeng/tokens$': '<rootDir>/../../packages/tokens/dist/index.js',
  // node-linker=hoisted 라 react 사본이 apps/mobile(19.2.3)·root(18.3.1)·일부 패키지의
  // 자체 node_modules(예: @testing-library/react-native, react-reconciler, test-renderer)에
  // 흩어져 있다. 사본이 다르면 버전이 같아도 훅 디스패처가 달라 "Cannot read properties of
  // null (reading 'useRef')"가 난다. apps/mobile 자신의 react/react-test-renderer(19.2.3,
  // jest-expo가 고정하는 버전과 동일)로 강제 고정해 하나의 인스턴스만 쓰게 한다.
  '^react$': '<rootDir>/node_modules/react',
  '^react/(.*)$': '<rootDir>/node_modules/react/$1',
  '^react-test-renderer$': '<rootDir>/../../node_modules/react-test-renderer',
  '^react-test-renderer/(.*)$': '<rootDir>/../../node_modules/react-test-renderer/$1',
};

module.exports = preset;
