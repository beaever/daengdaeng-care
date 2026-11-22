// expo-notifications 플러그인이 aps-environment 를 자동 추가한다.
// v1.0 은 로컬 알림만 쓰고 원격 푸시가 없으므로 Push Notifications 권한(entitlement)을 뺀다.
const { withEntitlementsPlist } = require('expo/config-plugins');

module.exports = function withoutApsEnvironment(config) {
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults['aps-environment'];
    return cfg;
  });
};
