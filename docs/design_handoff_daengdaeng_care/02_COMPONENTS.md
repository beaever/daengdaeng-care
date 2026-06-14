# 02 · 컴포넌트 명세 (Components)

> 원본 구현: `reference/daeng/components-core.jsx` (아톰·몰리큘), `components-compound.jsx` (컴파운드), 스타일 `components.css`.
> 모든 컴포넌트는 토큰만 참조합니다. 아래는 프레임워크 중립 명세 — 대상 코드베이스 관례로 재현하세요.

---

## A. 아톰 (Atoms)

### Button
- props: `variant` (primary·secondary·outline·ghost·danger), `size` (sm·default·lg), `block`, `leftIcon`, `disabled`
- 공통: 최소 높이 44px, radius `sm`(12), weight 700, gap 8, **press 시 `scale(.97)`** (120ms)
- variant별:
  | variant | 배경 | 글자 | 그림자 |
  |---|---|---|---|
  | primary | `brand` | `text-on-brand` | `shadow-brand` |
  | secondary | `surface-2` | `text` | none |
  | outline | `surface` | `text` | inset 1.5px `border-strong` |
  | ghost | transparent | `brand-text` | none |
  | **danger** | `danger` | `#fff` | `0 6px 18px rgba(224,65,59,.3)` |
- size: sm = 36px높이/14px, lg = 54px높이/17px/radius16
- disabled: opacity .45, 그림자 제거

### IconButton
- 44×44 원형, 투명 배경, press 시 `surface-2` 배경 + `scale(.92)`

### Badge — 3종
1. **SafetyBadge** `level: safe|caution|danger` → pill, soft 배경 + strong 글자 + 이모지. 라벨 자동:
   - safe → "✅ 먹어도 좋아요" / caution → "⚠️ 소량만 주세요" / danger → "🚨 절대 안 돼요"
2. **StatusBadge** `isOpen, is24h` → 점(dot) + 텍스트. 24시=브랜드색 "24시간", 진료중=그린, 마감=회색
3. **GradeBadge** `grade: A|B|C|D` → 64×64 라운드 박스, 등급별 그라데이션(A 그린→D 레드), 흰 글자 30px/800

### Chip
- pill, 최소높이 36px, `surface-2` 배경. variant: `brand`(brand-soft), `selected`(brand 채움). `onRemove` 시 ✕. press `scale(.95)`

### Input / Field / Textarea
- **Field**: 라벨(sub/700/text-2) + 필수 `*`(danger) 래퍼, gap 8
- **Input**: 높이 52px, `surface-2` 배경, radius sm, 좌측 옵션 아이콘. **focus 시 보더 `brand` + 배경 `surface`**
- placeholder 색 `text-3`

### Segment (세그먼트 컨트롤)
- `surface-sunken` 트랙 + 흰 thumb(`shadow-sm`)가 **`ease-spring`으로 슬라이드**. 활성 글자 `text`, 비활성 `text-2`. 뷰 전환(지도/목록), 기록 탭 등에 사용

### Option (라디오 행)
- 높이 58px, 좌측 24px 원형 체크. 선택 시 보더+배경 `brand-soft`, 체크 원 `brand` 채움 + 흰 체크가 `ease-spring`으로 pop. 증상 체크 보기 선택지에 사용

### PillGroup
- 균등분할 토글 버튼들(성별 남아/여아, 중성화 했어요/안했어요/몰라요). 활성=`brand-soft`+`brand-text`+brand 보더

### Avatar
- 원형. lg 92 / md 52 / sm 40. 이미지 또는 이모지(🐶) 폴백, 배경 `brand-soft`

### ProgressBar
- 높이 8px, 트랙 `surface-sunken`, 채움 `brand`, width를 `ease-out`으로 애니메이션

---

## B. 몰리큘 (Molecules)

### Card
- `surface` 배경, radius md(16), 1px `border`, `shadow-sm`. `pad` 시 내부 18px. `flat`=그림자 제거

### Row (리스트 행)
- 좌: 40×40 아이콘 박스(`brand-soft`/`brand-text`) · 중: **title(callout/700) + sub(caption/text-2)** · 우: chevron(text-3)
- **title↔sub 간격은 4px로 고정** (일관성 중요 — 이전에 들쭉날쭉 했던 부분)
- press 시 `surface-2` 배경

### Divider
- 1px `border`. `inset` 시 좌측 18px 들여쓰기

### SectionHeading
- sub(14)/800/`text-2`, 하단 10px 마진

### AdBanner (배너 광고) — 높이 **52px 고정**
- 좌측 `[AD]` 태그(미세 보더) + 썸네일 34×34 + 제목(caption/700) + 서브(11px/text-3). 상하 보더. **레이아웃에 항상 자리 예약**

### NativeAd (네이티브 광고)
- 카드 형태, `[AD] 광고` 라벨 + 52 썸네일 + 제목 + 서브. 리스트 중간(예: 병원 목록 3번째)에 삽입

### Verdict (결과 히어로) — **앱의 주인공 컴포넌트**
- `level: safe|caution|danger|emergency|today|watch`
- 풀컬러 그라데이션 카드, 중앙 정렬: 큰 이모지(40px) + 라벨(24/800/흰색) + 옵션 서브
- 그라데이션 매핑:
  | level | 그라데이션 | 라벨 기본값 |
  |---|---|---|
  | safe / watch | 그린 `#1FB85A→#14924A` | 먹어도 좋아요 / 지켜봐 주세요 |
  | caution / today | 골드 `#EBA417→#C98A05` | 소량만 주세요 / 오늘 안에 병원 |
  | danger | 레드 `#ED5A52→#C32D2D` | 절대 안 돼요 |
  | emergency | 진한 레드 `#EF4B43→#B01F1F` | 바로 병원으로 |

### EmptyState
- 중앙 정렬 아이콘(44px/이모지) + 타이틀(title/800) + 설명(sub/text-2) + 옵션 액션

### Note (면책/안내)
- `surface-2` 배경 박스, info 아이콘 + 작은 텍스트. 증상 결과의 "수의사 진단 대신 아님" 고지에 사용

### IngredientItem
- 순위 원형 뱃지 + 원료명 + 상태 태그(safe 좋아요/caution 주의/danger 위험)

### Bullets
- 불릿 리스트. variant `danger`(레드 점)·`safe`(그린 점)

---

## C. 컴파운드 컴포넌트 (Compound) — 조합 API

> 핵심: 하위 파트를 **네임스페이스로 노출**하고, `level`/`type`에 따라 **조건부로 조합**. 화면은 이걸 조립만 함.

### FoodResult — 음식 판별 결과
```
<FoodResult food={...}>
  <FoodResult.Header foodName />           // 음식 이름 (h1)
  <FoodResult.SafetyBadge level />         // = Verdict 히어로
  <FoodResult.Description level text serve/> // "왜 위험/주의/괜찮은가" + (안전·주의) 급여법
  <FoodResult.Symptoms items />            // ⚠️ danger/caution 일 때만 — 증상 불릿(danger)
  <FoodResult.Nutrition items />           // safe 일 때 영양소 칩
  <FoodResult.RelatedFoods level items />  // 관련/회피 음식 칩
  <FoodResult.AdBanner />
</FoodResult>
```
- **레벨별 조건부 렌더**: danger→증상O·영양X / caution→증상O·급여법O / safe→영양O·급여법O·증상X

### FoodAnalysisResult — 사료 성분 분석
```
<FoodAnalysisResult product={...}>
  <ProductHeader name brand image />
  <GradeBadge grade />                     // A~D + 라벨 카드
  <IngredientList> <IngredientItem rank name status /> …(TOP5)
  <WarningSection warnings />              // 주의 원료 카드(좌측 caution 보더)
</FoodAnalysisResult>
```

### SymptomChecker — 증상 단계 질문
```
<SymptomChecker current total question options onSelect>
  <ProgressBar current/total />            // 상단 진행 + "2/3"
  <Question text />                        // h1
  <Options> <Option label onClick /> …     // 라디오 행
</SymptomChecker>
```
- 선택 시: `option.verdict` 있으면 결과로, `option.next` 있으면 해당 인덱스 질문으로 분기 (의사결정 트리, data.js의 `symptomQuestions`)

### SymptomResult — 증상 체크 결과
```
<SymptomResult result onFindHospital>
  <SeverityBadge level />                  // = Verdict (emergency/today/watch)
  <Reason text />
  <ActionList items />                     // "지금 해주세요" / (watch)"집에서 이렇게"
  <WatchList items />                      // "이럴 땐 병원으로"(danger 불릿)
  <HospitalButton />                       // ⚠️ emergency/today 일 때만 (danger 버튼)
  <Disclaimer />                           // Note 고지
</SymptomResult>
```

### HospitalList / HospitalCard — 병원 찾기
```
<HospitalList>
  <ViewToggle value onChange />            // Segment: 지도/목록
  <RadiusSelector value />                 // 반경 칩
  <Map />                                  // 지도 영역(목업: 그리드+핀)
  <ResultCount count />
  <HospitalCard h onClick>
    <StatusBadge isOpen is24h /> <Distance />
    <Name /> <Hours /> <Phone />
  </HospitalCard> …                        // 3번째에 <NativeAd /> 삽입
</HospitalList>
```

### HealthRecord — 건강 기록 타임라인
```
<HealthRecord pet records tab onTab>
  <PetHeader />                            // 아바타 + 이름
  <CategoryTabs />                         // Segment: 전체/접종/체중/병원
  <Timeline>
    <TimelineGroup date>
      <VaccineEntry/WeightEntry/VetEntry data /> // 이모지+종류+제목+서브 카드
```
- 카테고리 탭으로 type 필터링. 기록 종류: vaccine 💉 / weight ⚖️ / vet 🏥

### 홈 전용 3종
- **PetProfileCard**: 아바타 + 이름/품종·나이 + 우측 "다음 접종 D-15" 칩
- **QuickMenu**: 2×2 그리드. 각 Item = 아이콘박스 + 라벨 + 서브. (음식판별/사료분석/증상체크/병원찾기)
- **HealthSummaryCard**: 행 3개(최근 체중 / 최근 병원 방문 / 다음 예방접종), inset divider로 구분

---

## D. 아이콘 매핑

원본은 2px 스트로크 커스텀 라인 아이콘(`reference/daeng/icons.jsx`). 동등 라이브러리로 대체 가능:

| 용도 | 원본 이름 | lucide 예시 | Material Symbols |
|---|---|---|---|
| 홈 탭 | home | home | home |
| 음식 탭 | bone | bone | nutrition |
| 증상 탭 | stethoscope | stethoscope | stethoscope |
| 병원 탭/버튼 | hospital | hospital / cross | local_hospital |
| 기록 탭 | clipboard | clipboard-list | assignment |
| 검색 | search | search | search |
| 추가(FAB) | plus | plus | add |
| 알림 | bell | bell | notifications |
| 설정 | gear | settings | settings |
| 전화 | phone | phone | call |
| 길찾기 | directions | navigation | directions |
| 바코드 | barcode | scan-barcode | barcode_scanner |
| 카메라 | camera | camera | photo_camera |
| 체중 | weight | scale | monitor_weight |
| 접종 | syringe | syringe | vaccines |
| 뒤로 | back | chevron-left | arrow_back_ios |

> **주의(프로토타입 교훈)**: 아이콘 컴포넌트에 `strokeWidth`를 넘길 때 `stroke`(색상) 속성과 혼동하지 마세요. 색이 아닌 두께로 전달되어야 합니다.
