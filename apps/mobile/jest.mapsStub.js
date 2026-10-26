// react-native-maps 스텁 (jest 전용) — jest.config.js 의 moduleNameMapper 참고.
const { View } = require('react-native');

module.exports = { __esModule: true, default: View, Polyline: View, Marker: View };
