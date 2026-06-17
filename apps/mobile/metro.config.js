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

module.exports = config;
