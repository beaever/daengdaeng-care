# Claude Code 에게 명령하는 법 (HOW_TO_PROMPT)

이 핸드오프 폴더를 프로젝트 루트(또는 레포 안)에 두고, Claude Code 를 실행한 뒤 아래처럼 지시하세요.

---

## STEP 0. 준비
1. 이 폴더(`design_handoff_daengdaeng_care/`)를 개발할 레포 안에 복사해 둡니다.
2. 터미널에서 레포 루트로 이동 → `claude` 실행.
3. (선택) `reference/Overview.html`을 브라우저로 먼저 열어 디자인을 눈으로 확인.

---

## STEP 1. 첫 명령 (컨텍스트 인식시키기) — 복붙

```
design_handoff_daengdaeng_care/ 폴더에 댕댕케어 앱의 디자인 핸드오프가 들어있어.
먼저 README.md, 01_DESIGN_TOKENS.md, 02_COMPONENTS.md, 03_SCREENS.md,
04_INTERACTIONS_AND_RULES.md 를 모두 읽고,
reference/ 안의 HTML/JSX 프로토타입도 살펴봐.

다 읽은 뒤, 구현 계획을 먼저 제안해줘. 아직 코드는 작성하지 마.
- 이 레포의 현재 스택/구조를 파악하고, 그 관례에 맞춰 구현할 것
- (스택이 없다면) iOS·Android 동시 배포 목표에 맞는 프레임워크를 추천해줘
- 토큰 → 아톰 → 몰리큘 → 컴파운드 → 화면 순서로 진행할 계획을 단계로 나눠줘
```

> Claude Code 가 계획을 보여주면 검토 후 수정 요청. 그다음 단계별로 진행.

---

## STEP 2. 단계별 구현 명령 (순서대로)

**① 토큰부터**
```
01_DESIGN_TOKENS.md 대로 theme(토큰) 파일을 만들어줘.
라이트/다크 둘 다, 색·타이포·간격·라운드·그림자 전부.
이후 모든 스타일은 이 토큰만 참조하고, hex/숫자 하드코딩은 하지 마.
```

**② 아톰 → 몰리큘**
```
02_COMPONENTS.md 의 A(아톰), B(몰리큘) 컴포넌트를 만들어줘.
Button/Badge(SafetyBadge·StatusBadge·GradeBadge)/Chip/Input/Segment/Option/
Avatar/Card/Row/Verdict/AdBanner/EmptyState/Note 등.
press 스케일, focus 상태, ease-spring 모션까지 명세대로.
각 컴포넌트는 간단한 미리보기(스토리/예시 화면)도 같이.
```

**③ 컴파운드**
```
02_COMPONENTS.md 의 C(컴파운드)를 만들어줘.
FoodResult / FoodAnalysisResult / SymptomChecker / SymptomResult /
HospitalList·HospitalCard / HealthRecord / PetProfileCard / QuickMenu / HealthSummaryCard.
레벨(level)·종류(type)에 따른 조건부 조합 로직을 반드시 지킬 것.
목업 데이터는 reference/daeng/data.js 스키마를 그대로 써줘.
```

**④ 화면 + 네비게이션**
```
03_SCREENS.md 의 16개 화면을 만들고, 하단 5탭 + 스택 네비게이션으로 연결해줘.
스플래시→온보딩→프로필→홈 진입 플로우, 04 문서의 광고 규칙과
안전영역(safe-area)·터치타깃 규칙을 반드시 지킬 것.
특히 응급(emergency) 플로우엔 광고를 절대 넣지 마.
```

**⑤ 마감 점검**
```
04_INTERACTIONS_AND_RULES.md 기준으로 점검해줘:
- 다크모드에서 모든 텍스트/카드 색이 테마 토큰을 따르는지
- 360dp(가장 좁은 안드로이드)에서 레이아웃이 안 깨지는지
- 탭바가 하단 safe-area에 여유를 두는지
- 모든 광고에 [AD] 라벨이 있고 응급 화면엔 광고가 없는지
- 한글 줄바꿈(keep-all)이 적용됐는지
```

---

## STEP 3. 자주 쓰는 후속 명령 예시
```
· "FoodResult 화면을 reference/Prototype.html 의 '음식 결과' 와 픽셀 단위로 맞춰줘."
· "이 컴포넌트, 우리 레포의 기존 Button 패턴(파일 경로 X)을 따르게 리팩터해줘."
· "다크모드 스크린샷 찍어서 명세랑 비교해줘."
· "data.js 목업을 실제 API 연동 구조로 바꾸되, 화면은 그대로 두고 데이터 레이어만 분리해줘."
```

---

## 핵심 원칙 (Claude Code 에게 꼭 전달)
1. **HTML은 레퍼런스** — 그대로 이식하지 말고 대상 환경의 관례로 **재현**
2. **토큰이 단일 출처** — 색·간격·폰트 하드코딩 금지
3. **조합형** — 작은 단위부터 쌓고, 화면은 컴파운드의 조립으로
4. **안전 규칙은 타협 불가** — 응급 화면 무광고, safe-area, 최소 터치타깃, 다크모드 토큰
5. **막히면** `reference/daeng/` 의 원본 구현을 직접 열어볼 것
