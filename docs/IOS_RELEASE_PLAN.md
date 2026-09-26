# 댕댕케어 v1.0 — iOS 출시 개발 계획

> **목표:** App Store 심사 통과 및 출시. **iOS만**, **광고 없음**.
> **진행 방식:** 태스크 하나 = 브랜치 하나 = PR 하나. `/harness <태스크ID>` 로 실행한다.
> 체크박스는 PR이 `dev` 에 머지되면 체크한다.

---

## 확정된 결정

| 결정 | 내용 | 근거 |
|------|------|------|
| 플랫폼 | iOS 전용. `android` 설정은 두되 빌드·QA하지 않음 | 출시 범위 축소 |
| 광고 | **v1.0 미적용.** 화면의 광고 자리 표시자도 제거. MAU가 오르면 v1.x에서 도입 | 사용자 결정 (2026-09-26) |
| 컴포넌트 | 앱은 `apps/mobile/components` (RN)만 사용. `packages/ui` 는 웹·Storybook용으로 동결 | 앱이 `packages/ui` 를 import하지 않음 |
| 데이터 | 음식·증상은 `@daengdaeng/constants`를 단일 출처로 사용. `lib/sampleData.ts` 는 삭제 대상 | 테스트된 로직과 실제 앱 로직 일치 |
| 로컬 DB | `expo-sqlite` 직접 사용 (Drizzle 없음) | 테이블이 2개라 ORM이 오버헤드 |
| 다크모드 | v1.0은 라이트 고정 (`userInterfaceStyle: "light"`). 다크는 v1.1 | `theme.ts` 의 `colors` 가 light로 고정되어 있음 |
| 캐시 | v1.0은 캐시 없이 로딩·에러·오프라인 상태만 처리 | 트래픽이 한도(카카오 월 300만 건)보다 훨씬 적음 |

---

## 담당 에이전트 (`.claude/agents/`)

| 에이전트 | 모델 | 하네스 파트 | 역할 |
|----------|------|-------------|------|
| `planner` | opus | PRODUCT | 태스크를 구현 단계로 쪼갬, 범위·리스크 판단 (읽기 전용) |
| `mobile-engineer` | sonnet | FRONTEND·DESIGN | `apps/mobile` 화면과 컴포넌트 구현 |
| `data-engineer` | sonnet | BACKEND | SQLite, Kakao/OPFF 연동, 권한, 에러 처리 |
| `release-engineer` | sonnet | INFRA | Expo SDK, app.json/eas.json, 권한 문구, 스토어 제출 |
| `qa-engineer` | sonnet | QA | 테스트 작성, 검증 명령 실행 |
| `rules-guard` | haiku | RULES | RULES.md 위반 검사 (읽기 전용, 빠름) |

---

## Phase 0 — 기반 정비

- [ ] **T0.1 Expo SDK 업그레이드** · `release-engineer`
  - 배경: Apple은 2026-04-28 이후 업로드되는 앱에 iOS 26 SDK(Xcode 26) 빌드를 요구한다. SDK 52 / RN 0.76이 EAS의 Xcode 26 이미지에서 빌드되는지 **먼저 확인**하고, 안 되면 Xcode 26을 지원하는 최신 SDK로 올린다.
  - 완료 조건: `npx expo-doctor` 통과, 시뮬레이터에서 5개 탭 정상 동작, `eas build -p ios --profile preview` 성공
- [ ] **T0.2 광고 코드 제거** · `mobile-engineer`
  - `food/result`, `symptom/result`, `record/index`, `hospital/index` 의 AdBanner/NativeAd 제거
  - `symptom/interstitial.tsx` 삭제: `questions → result` 로 바로 이동
  - `components/ui/AdBanner.tsx`, `NativeAd.tsx` 삭제 (필요하면 git 이력에서 복원)
  - 완료 조건: `grep -rn "AdBanner\|NativeAd\|interstitial" apps/mobile/app apps/mobile/components` 결과 0건
- [ ] **T0.3 데이터 단일 출처화** · `mobile-engineer`
  - `apps/mobile` 에 `@daengdaeng/constants` 의존성 추가
  - 음식 검색은 `searchFood`, 증상은 `SYMPTOM_CATEGORIES` 등으로 교체
  - 완료 조건: `sampleData` 에 음식·증상 데이터가 남지 않음, 영문 별칭 검색("grape")이 앱에서 동작
- [ ] **T0.4 모바일 테스트 러너 + CI** · `qa-engineer`
  - `jest-expo` + `@testing-library/react-native` 도입, CI의 `turbo test` 에 모바일 포함
  - 첫 테스트: 증상 결과 화면에 면책 고지가 항상 보임 (규칙 4)
  - 완료 조건: CI에서 모바일 테스트 실행·통과

## Phase 1 — 기능 실데이터화 (F001~F006)

- [ ] **T1.1 로컬 DB + 반려견 프로필 (F006)** · `data-engineer`
  - `expo-sqlite` 로 `pets`, `records` 테이블 구성 (스키마는 BACKEND.md), `PRAGMA user_version` 으로 마이그레이션
  - 온보딩과 프로필 편집 저장, 반려견 사진은 `expo-image-picker`
  - 완료 조건: 앱을 재시작해도 프로필 유지, 첫 실행이면 온보딩으로 이동
- [ ] **T1.2 건강 기록 CRUD (F005)** · `mobile-engineer` (T1.1 이후)
  - 기록 추가·목록·삭제를 DB와 연결, 빈 상태 표시
  - 완료 조건: 재시작 후 기록 유지, 날짜순 정렬
- [ ] **T1.3 병원 찾기 (F004)** · `data-engineer` → `mobile-engineer`
  - `expo-location` (사용 중 권한) + Kakao Local 키워드 검색. 키는 `EXPO_PUBLIC_KAKAO_KEY` (EAS 환경변수)
  - 권한 거부 시: 지역명 입력으로 대체. 전화(`tel:`)와 길찾기(카카오맵/Apple 지도 링크)
  - 완료 조건: 실기기에서 주변 병원이 거리순으로 표시, 권한 거부·오프라인·API 실패 각각 안내
  - 리스크: REST 키가 앱 번들에 포함된다. 카카오 콘솔에서 사용량 알림을 설정해 둔다.
- [ ] **T1.4 사료 분석 (F002)** · `data-engineer` → `mobile-engineer`
  - `expo-camera` 바코드 스캔 + Open Pet Food Facts 조회, 조회 실패 시 "등록되지 않은 제품" 안내와 수동 검색
  - **결정 게이트:** 착수 전 국내 주요 사료 바코드 20개의 OPFF 등록률을 확인한다. 등록률이 낮으면 F002를 v1.1로 미루고 사료 탭을 숨긴다. 샘플 데이터 화면을 그대로 내보내면 심사 4.2(최소 기능) 거절 위험이 있다.
  - 완료 조건: 실기기 스캔 → 성분 표시, 미등록·권한 거부 처리
- [ ] **T1.5 전역 에러·오프라인 처리** · `mobile-engineer`
  - 네트워크가 필요한 화면(병원, 사료)의 로딩·에러·오프라인 상태
  - 완료 조건: 비행기 모드에서 모든 탭이 멈추지 않고 안내 문구 표시
- [ ] **T1.6 `sampleData.ts` 삭제** · `mobile-engineer`
  - 완료 조건: 파일 삭제, `grep -rn sampleData apps/mobile` 결과 0건

## Phase 2 — iOS 품질

- [ ] **T2.1 앱 설정 정리** · `release-engineer`
  - `app.json`: `icon` (1024px), 스플래시 이미지, `userInterfaceStyle: "light"`, `ios.config.usesNonExemptEncryption: false`
  - `infoPlist` 권한 문구(한국어): 카메라, 위치(사용 중), 사진 보관함
  - 사용하는 SDK의 `privacyManifests` (Required Reason API) 확인
  - `_layout.tsx` 의 StatusBar를 라이트 고정 테마와 맞춤
  - 완료 조건: `eas build` 결과물의 Info.plist에 권한 문구 3종 포함
- [ ] **T2.2 접근성 기본** · `mobile-engineer`
  - 터치 타깃 44pt, 아이콘 버튼에 `accessibilityLabel`, 큰 글씨(Dynamic Type 최대)에서 레이아웃 확인
- [ ] **T2.3 실기기 QA** · `qa-engineer`
  - QA.md 체크리스트를 iPhone SE(375pt)와 Pro Max에서 수행, TestFlight 내부 테스터 배포
  - 완료 조건: 치명 버그 0건, 결과는 PR 또는 이슈로 기록

## Phase 3 — App Store 제출

- [ ] **T3.1 앱 레코드·인증서** · 사람 (`release-engineer` 가 안내)
  - ✅ Apple Developer Program 가입 완료
  - App Store Connect에서 번들 ID `care.daengdaeng.app` 으로 앱 생성
  - `eas.json` 의 `submit.production.ios.ascAppId` 입력, `eas credentials` 로 인증서·프로비저닝 생성
- [ ] **T3.2 개인정보처리방침·지원 페이지** · `mobile-engineer` (apps/web)
  - `apps/web` 에 `/privacy`, `/support` 추가 후 Vercel 배포. 앱 설정 화면에도 링크
  - 내용: 데이터는 기기에만 저장, 위치는 병원 검색 요청 시 카카오에만 전송, 광고·추적 없음
- [ ] **T3.3 App Privacy·연령 등급** · `release-engineer`
  - 광고·추적이 없으므로 ATT 불필요. 위치는 "앱 기능, 사용자와 연결되지 않음"으로 신고할지 검토
- [ ] **T3.4 메타데이터** · `release-engineer`
  - 6.9인치 스크린샷, 앱 이름, 부제, 설명, 키워드, 카테고리(라이프스타일 권장. 의료 카테고리는 심사가 엄격함)
  - 심사 노트: 증상 체크는 참고용이며 진단이 아니라는 설명과 음식 DB 출처 명시 (가이드라인 1.4.1 대응)
- [ ] **T3.5 릴리스** · `release-engineer`
  - `/gitflow release v1.0.0` → `dev → main` 머지 → `/ios-release` (production 빌드 + submit)
  - 완료 조건: 심사 제출. 거절되면 사유를 기록하고 fix 태스크를 추가

---

## v1.0 범위 밖 (출시 후)

| 항목 | 도입 조건 |
|------|-----------|
| 광고 (AdMob + ATT + SKAdNetwork) | MAU 기준 달성 시. 규칙 1(응급 화면 무광고)은 그때도 유지 |
| 다크모드 | v1.1 (`theme.ts` 에 `useColorScheme` 연결) |
| API 캐시 | 카카오 호출량이 무료 한도에 가까워질 때 |
| 푸시 알림, 다중 프로필, Android | PRODUCT.md 로드맵 |

## 실행 순서 요약

```
T0.1 ─┬─ T0.2 ─ T0.3 ─ T0.4
      └─ T1.1 ─ T1.2
         T1.3, T1.4 (병렬 가능) ─ T1.5 ─ T1.6
                                          └─ T2.1 ─ T2.2 ─ T2.3 ─ T3.x
T3.1(앱 레코드·ascAppId)은 사람이 할 일이고 선행 조건이 없으므로 아무 때나 먼저 해둘 수 있음
```
