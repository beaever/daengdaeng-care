---
name: ios-release
description: iOS 릴리스 사전 점검과 EAS 빌드·TestFlight·App Store 제출 절차. 사용 예: /ios-release preflight, /ios-release testflight, /ios-release submit
---

# /ios-release [preflight|testflight|submit]

`release-engineer` 에이전트(sonnet)에 위임한다. 인자가 없으면 `preflight` 로 실행한다.

## preflight (항상 먼저, 빌드 비용 없음)
`apps/mobile` 에서 아래를 확인하고 ✅/❌ 표로 보고한다.

| 항목 | 확인 방법 |
|------|-----------|
| 품질 게이트 | 루트에서 `pnpm type-check && pnpm lint && pnpm test` |
| 규칙 | `rules-guard` 에이전트 (apps/mobile 전체) |
| Expo 상태 | `npx expo-doctor` |
| 아이콘·스플래시 | `app.json` 의 `icon`, `splash.image` 파일 존재 |
| 권한 문구 | `npx expo config --type introspect` 의 `ios.infoPlist` 에 사용하는 권한의 `NS*UsageDescription` 존재 |
| 암호화 신고 | `ios.config.usesNonExemptEncryption === false` |
| 광고·추적 없음 | `NSUserTrackingUsageDescription`, `GADApplicationIdentifier` 없음 |
| 환경변수 | `eas env:list --environment production` 에 `EXPO_PUBLIC_KAKAO_KEY` 존재 (값은 출력하지 않음) |
| 제출 설정 | `eas.json` 의 `submit.production.ios.ascAppId` 존재 |
| 버전 | `app.json` 의 `version` 이 이번 릴리스 버전과 일치 |

❌가 하나라도 있으면 빌드 단계로 넘어가지 않는다.

## testflight (TestFlight 내부 테스트)
preflight 통과 후 **사용자 확인을 받고** 실행한다 (EAS 무료 빌드 한도):
```bash
cd apps/mobile
eas build -p ios --profile production
eas submit -p ios --latest        # TestFlight 업로드
```
> 참고: 실기기 ad-hoc 설치가 목적이면 `--profile preview` (기기 UDID 등록 필요). TestFlight 배포는 production 빌드를 사용한다.

## submit (심사 제출)
- `main` 브랜치이고, 태그 `v<version>` 이 있는지 확인한다.
- 사용자가 TestFlight 빌드를 확인했는지 묻는다.
- App Store Connect에서 할 일(사람이 직접): 빌드 선택, 스크린샷·설명, App Privacy, 심사 노트 → "심사에 제출".
- 명령과 체크리스트만 제시하고, 제출 자체는 사용자가 한다.

## 거절 대응
심사 거절 사유를 받으면 `docs/IOS_RELEASE_PLAN.md` 에 `fix` 태스크를 추가하고 `/harness` 로 처리한다.
