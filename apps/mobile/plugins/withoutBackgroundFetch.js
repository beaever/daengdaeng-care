// expo-task-manager 플러그인이 UIBackgroundModes 에 'fetch' 를 자동 추가한다.
// 앱은 백그라운드 fetch 를 쓰지 않으므로 심사(2.5.4)에서 미사용 모드로 지적되지 않게 뺀다.
const { withInfoPlist } = require('expo/config-plugins');

module.exports = function withoutBackgroundFetch(config) {
  return withInfoPlist(config, (cfg) => {
    const modes = cfg.modResults.UIBackgroundModes;
    if (Array.isArray(modes)) cfg.modResults.UIBackgroundModes = modes.filter((m) => m !== 'fetch');
    return cfg;
  });
};
