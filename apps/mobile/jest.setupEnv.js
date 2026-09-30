// jest-expo 의 babel transform(jest-preset.js)은 babel-preset-expo에 caller.platform='ios'를
// 넘겨 `process.env.EXPO_OS`를 빌드 타임에 인라인한다. 이 프로젝트는 jest.config.js에서
// hermes-parser 이슈 우회를 위해 babel transform을 `@react-native/babel-preset`으로 교체했고,
// 그 과정에서 caller.platform 인라인이 함께 빠졌다. 그 결과 expo-modules-core/Platform.ts의
// `typeof process.env.EXPO_OS === 'undefined'` 체크가 항상 true가 되어 console.warn을 찍는데,
// 이 경고가 테스트 종료 후 비동기로 (lazy global.fetch getter → expo-modules-core require) 찍혀
// "Cannot log after tests are done"로 처리되며 전체 테스트 프로세스가 exit 1로 끝난다.
// 모든 setupFiles보다 먼저 실행되도록 jest.config.js에서 배열 맨 앞에 등록해 둔다.
process.env.EXPO_OS = process.env.EXPO_OS || 'ios';
