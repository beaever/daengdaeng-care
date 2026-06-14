# Frontend — 댕댕케어 하네스 가이드

## 역할 범위
Frontend는 **컴포넌트 라이브러리 + 모바일 앱 + 랜딩페이지** 구현을 소유한다.

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 모노레포 | Turborepo + pnpm |
| 컴포넌트 라이브러리 | React 18 + TypeScript + Vite |
| 문서화/시각 테스트 | Storybook 8 + Chromatic |
| 모바일 앱 | Expo (Managed Workflow) + React Native + TypeScript |
| 네비게이션 | Expo Router |
| 로컬 DB | expo-sqlite + Drizzle ORM |
| 랜딩페이지 | Next.js |
| 빌드 (모바일) | EAS Build (AdMob 네이티브 모듈 필수) |

---

## 패키지 구조

```
daengdaeng-care/
├── apps/
│   ├── mobile/     ← Expo RN 앱
│   └── web/        ← Next.js 랜딩
├── packages/
│   ├── ui/         ← 컴포넌트 라이브러리 (여기서 먼저 만들고 앱에서 가져다 씀)
│   ├── tokens/     ← 디자인 토큰 TS 정의
│   └── constants/  ← 음식 DB, 증상 트리, 공통 타입
```

---

## 컴포넌트 개발 순서 (반드시 이 순서)

```
1. packages/tokens  → 토큰 정의
2. packages/ui/atoms → Button, Badge, Input, Chip, Avatar ...
3. packages/ui/molecules → Card, Row, Verdict, AdBanner ...
4. packages/ui/compound → FoodResult, SymptomChecker ...
5. apps/mobile → 화면 조립 (compound 가져다 사용)
```

---

## Compound Component 패턴 규칙

```tsx
// ✅ 올바른 사용
<FoodResult food={data}>
  <FoodResult.Header />
  <FoodResult.SafetyBadge />
  <FoodResult.Description />
  <FoodResult.Symptoms />
  <FoodResult.AdBanner />      // 응급 화면이 아닐 때만
</FoodResult>

// ❌ 금지 — level별 조건 분기를 바깥에서 하지 마라
{food.level === 'danger' && <DangerComponent />}
// 이런 분기는 컴파운드 내부에서 처리한다
```

---

## 코딩 규칙

- 모든 스타일: CSS Modules 사용, 인라인 스타일 원칙적 금지
- 색상: CSS 변수(`var(--brand)`) 사용, hex 하드코딩 금지
- 한글 텍스트: `word-break: keep-all` 필수 (global.css 이미 적용)
- 최소 터치 타깃: 44px (모바일 앱), `--hit` 변수 활용
- 광고 배너: 52px 공간 항상 사전 예약 (`--ad-banner-h`)
- 응급 화면: 어떤 광고 컴포넌트도 렌더 금지

---

## 광고 렌더링 규칙 (Frontend 구현 의무)

```tsx
// 응급 여부 체크 후 광고 렌더
{result.level !== 'emergency' && <AdBanner />}

// 인터스티셜: 증상 결과 진입 전 (비응급만)
// 배너: 결과 화면 하단 고정
// 네이티브: 병원 목록 index === 2 위치
```

---

## PR 체크리스트 (Frontend)

- [ ] `pnpm type-check` 통과
- [ ] `pnpm lint` 통과
- [ ] 새 컴포넌트에 Story 파일 있음
- [ ] 다크모드 토큰 사용 확인
- [ ] 응급 화면 광고 없음 확인
- [ ] 터치 타깃 44px 이상 확인
