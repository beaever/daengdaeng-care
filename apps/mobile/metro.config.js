// Metro 설정 — pnpm 모노레포 대응 (workspace 루트 watch + node_modules 해석)
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 워크스페이스 패키지(@daengdaeng/*) 변경을 반영하도록 기본값에 루트를 추가 watch
config.watchFolders = [...(config.watchFolders ?? []), workspaceRoot];
// node-linker=hoisted 라 의존성이 루트 node_modules 에 평탄화됨.
// 앱 → 루트 순으로 탐색하되, 계층적 탐색은 끄지 않는다(hoisted 권장값).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// apps/web·packages/ui 는 React 18을 쓴다. hoisted 레이아웃에서 pnpm이 루트에
// 어느 버전을 올릴지는 install 시점 의존성 그래프에 따라 달라질 수 있어,
// Metro가 파일마다 다른 react 사본을 찾는(중복 인스턴스) 사고를 막기 위해
// mobile 자신의 require 해석 기준으로 react/react-native 경로를 고정한다.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.dirname(require.resolve('react/package.json', { paths: [projectRoot] })),
  'react-native': path.dirname(
    require.resolve('react-native/package.json', { paths: [projectRoot] })
  ),
};

module.exports = config;
