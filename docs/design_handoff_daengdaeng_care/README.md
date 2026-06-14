# 댕댕케어(DaengDaeng Care) — Claude Code 개발 핸드오프

> 반려견 건강 관리 올인원 앱. iOS · Android 동시 배포. 이 문서 하나로 동일한 디자인을 실제 코드베이스에 구현할 수 있도록 작성되었습니다.

---

## 0. 이 문서의 사용법 (Claude Code 에게)

이 폴더(`design_handoff_daengdaeng_care/`)는 **디자인 레퍼런스**입니다.
`reference/` 안의 HTML/JSX 파일들은 **최종 디자인의 모양과 동작을 보여주는 프로토타입**이며, **그대로 복사해 출시하는 production 코드가 아닙니다.**

당신(Claude Code)의 임무는:
> **이 HTML 디자인을, 대상 프로젝트의 실제 환경(React Native / Flutter / SwiftUI+Kotlin / Expo 등)에서 그 환경의 관례·라이브러리로 "재현"하는 것**입니다.

- 이미 코드베이스가 있다면 → 그 프로젝트의 기존 패턴·디자인 시스템·네비게이션 라이브러리를 따르세요.
- 아직 환경이 없다면 → iOS·Android 동시 배포가 목표이므로 **React Native (Expo) 또는 Flutter** 중 프로젝트에 맞는 것을 선택해 구현하세요. (이 문서는 두 경우 모두를 가정해 토큰·컴포넌트를 프레임워크 중립적으로 기술합니다.)

### Fidelity: **High-fidelity (hifi)**
색상·타이포·간격·인터랙션이 모두 확정된 픽셀 단위 목업입니다. **UI를 픽셀 단위로 충실히 재현**하되, 스타일 값(색/간격/폰트)은 반드시 아래 **디자인 토큰**을 단일 출처로 사용하세요. 하드코딩 금지.

### 문서 구성
| 파일 | 내용 |
|---|---|
| `README.md` (이 문서) | 개요 · 사용법 · 아키텍처 · 토큰 |
| `01_DESIGN_TOKENS.md` | 색·타이포·간격·라운드·그림자 전체 값 |
| `02_COMPONENTS.md` | 아톰→몰리큘→컴파운드 컴포넌트 명세 |
| `03_SCREENS.md` | 16개 화면 레이아웃·동작·상태 |
| `04_INTERACTIONS_AND_RULES.md` | 인터랙션·광고·안전영역·비즈니스 규칙 |
| `reference/` | 실제 동작하는 HTML 프로토타입 (브라우저로 열어 확인) |

> **먼저** `reference/Overview.html`을 브라우저로 열어 4개 산출물(디자인시스템·브랜드·프로토타입·스토어샷)을 직접 눌러보고 시작하세요. 프로토타입은 화면 점프 메뉴 + iPhone/Android 동시 미리보기를 제공합니다.

---

## 1. 제품 개요

강아지 보호자가 일상에서 겪는 3가지 궁금증을 빠르게 해결하는 앱:

1. **음식 판별** — "이거 먹여도 돼?" 검색 → 안전/주의/위험 즉시 판정
2. **사료 성분 분석** — 바코드 스캔 → 원료 등급(A~D) + 주의 원료
3. **증상 체크** — 증상 입력 → 단계별 질문 → "병원 가야 하나?" 판정
4. **병원 찾기** — 근처 24시 동물병원 지도·목록
5. **건강 기록** — 접종·체중·병원 방문 타임라인

수익화: 배너·네이티브·전면(인터스티셜) 광고. **단, 응급 상황 화면에는 광고를 절대 노출하지 않음** (04 문서 참조).

타깃 디바이스: iPhone (390–402pt 폭) · Galaxy/Android (360–412dp 폭). 이 범위에서 깨지지 않도록 설계됨.

---

## 2. 아키텍처 — "조합형 컴포넌트"

이 디자인의 핵심 원칙은 **작은 단위부터 조합(compound)** 입니다. 그대로 코드 구조에 반영하세요:

```
토큰 (tokens)          ← 색·타입·간격·라운드. 모든 스타일의 단일 출처
  └ 아톰 (atoms)        ← Button, Badge, Chip, Input, Avatar, Segment …
      └ 몰리큘 (molecules) ← Card, Row, AdBanner, Verdict, EmptyState …
          └ 컴파운드 (compound) ← FoodResult, SymptomChecker, HospitalList …
              └ 화면 (screens)  ← 16개 화면 = 컴파운드의 조합
```

**컴파운드 컴포넌트 패턴**: 결과/리스트성 컴포넌트는 하위 파트를 네임스페이스로 노출합니다. 예:
```
<FoodResult>
  <FoodResult.Header />
  <FoodResult.SafetyBadge />
  <FoodResult.Description />
  <FoodResult.Symptoms />      ← danger/caution 일 때만
  <FoodResult.RelatedFoods />
  <FoodResult.AdBanner />
</FoodResult>
```
타깃 프레임워크에 맞게 표현하세요 (React/RN: 정적 프로퍼티 또는 slot props · Flutter: 위젯 합성 · SwiftUI: 자식 뷰 구성). 핵심은 **레벨에 따라 하위 파트가 조건부로 조합된다**는 점입니다.

### 권장 폴더 구조 (예: React Native)
```
src/
  theme/        tokens.ts (01 문서 그대로)
  components/
    atoms/      Button, Badge, Chip, Input, Avatar, Segment, Option, …
    molecules/  Card, Row, AdBanner, NativeAd, Verdict, EmptyState, Note
    compound/   FoodResult, FoodAnalysisResult, SymptomChecker,
                SymptomResult, HospitalList, HospitalCard, HealthRecord,
                PetProfileCard, QuickMenu, HealthSummaryCard
  screens/      16개 화면
  navigation/   탭 + 스택 (아래)
  data/         food DB, symptom tree, hospitals, records (목업)
```

### 네비게이션
- **하단 탭 5개**: 홈 / 음식 / 증상 / 병원 / 기록
- 각 탭은 자체 **스택**을 가짐 (예: 음식 탭 = 검색 → 결과, 스캔 → 분석결과)
- 앱 진입: 스플래시 → 온보딩(최초 1회) → 프로필 등록(최초 1회) → 홈
- 설정·기록추가는 모달/푸시 스택

---

## 3. 디자인 토큰 요약

전체 값은 **`01_DESIGN_TOKENS.md`** 와 `reference/daeng/tokens.css` 참조. 라이트/다크 모두 정의됨.

- **브랜드**: 따뜻한 앰버 `#F59E0B` (primary)
- **안전도 의미색**: 안전=그린 `#16A34A` / 주의=골드 `#C98A05` / 위험=레드 `#E0413B`
- **폰트**: **SUIT** (둥글고 친근, 한글 가독성). 폴백: Pretendard, Apple SD Gothic Neo
- **그리드**: 4pt 단위
- **라운드**: 카드 16, 버튼 12, pill 999 (iOS 느낌의 넉넉한 곡률)
- **테마**: 라이트(웜 크림 `#FFFDF9`) + 다크(`#14110B`) 둘 다 지원

---

## 4. 에셋

- **로고/마크**: SVG 패스로 제공 (이미지 파일 아님). `reference/daeng/marks.jsx` 에 3종(`MarkA` 하트 / `MarkB` 체크 / `MarkC` 라인+펄스). **최종 채택: MarkA (발바닥+하트)**. 스플래시·앱아이콘·헤더 로고에 사용.
- **아이콘**: 2px 스트로크 라인 아이콘 세트, SVG 패스로 제공 (`reference/daeng/icons.jsx`). 타깃에서는 동등한 아이콘 라이브러리(예: lucide, Material Symbols)로 대체 가능 — 매핑 표는 02 문서.
- **이모지**: 안전도(✅⚠️🚨)·증상 카테고리(🤢😮‍💨🦴…)·기록 종류(💉⚖️🏥)에 절제해 사용. 시스템 이모지 그대로.
- **사진**: 반려견 프로필 사진은 사용자 업로드. 목업에선 🐶 플레이스홀더.
- 외부 이미지 의존성 없음. SUIT 폰트만 웹폰트로 로드(`reference/daeng/tokens.css` 상단 @import) — 네이티브에선 폰트 파일을 번들에 포함.

---

## 5. Claude Code 에게 보낼 명령 (복붙용)

아래 6절에 그대로 쓸 수 있는 프롬프트가 있습니다. 핵심은: **(1) 이 폴더를 레퍼런스로 지정 → (2) 토큰부터 → 아톰 → 컴파운드 → 화면 순서로 → (3) 기존 코드베이스 관례 준수** 입니다.

---

## 6. 참조 파일 (프로젝트 내 디자인 소스)

`reference/daeng/` 안에서 구현 시 직접 들여다볼 파일:

| 파일 | 역할 |
|---|---|
| `tokens.css` | **모든 디자인 토큰** (라이트/다크). 가장 먼저 이식 |
| `components.css` | 컴포넌트 스타일 클래스 (간격·색·상태) |
| `components-core.jsx` | 아톰·몰리큘 구현 |
| `components-compound.jsx` | 컴파운드 컴포넌트 구현 (조합 로직 포함) |
| `app/screens.jsx` | **16개 화면** 전체 구현 |
| `app/shell.jsx` | 헤더·탭바·안전영역 inset 로직 |
| `data.js` | 목업 데이터 (음식 DB·증상 트리·병원·기록) |
| `icons.jsx` / `marks.jsx` | 아이콘·로고 SVG |
| `app.css` | 화면 단위 레이아웃 (스플래시·온보딩·스캔·증상 등) |

> 모든 산출물(문서·프로토타입·스토어샷)이 위 단일 소스를 공유합니다. 즉 `tokens.css` + `components*` 만 정확히 이식하면 화면은 조합으로 따라옵니다.
