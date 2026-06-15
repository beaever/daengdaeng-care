# 댕댕케어 — Claude Code 가이드

## 프로젝트 개요
반려견 건강 관리 앱 (iOS). 음식 판별·사료 분석·증상 체크·병원 찾기·건강 기록 5가지 기능.
React Native + Expo + TypeScript + pnpm + Turborepo 모노레포.

## 핵심 규칙 (RULES.md 전문 참고)

1. **응급 화면에 절대 광고 없음** — emergency 레벨에서 AdBanner/NativeAd 렌더 금지
2. **토큰 단일 출처** — hex 하드코딩 금지, `var(--brand)` 등 CSS 변수 사용
3. **Compound Component 패턴** — 화면은 컴파운드 조립만. 레벨 분기는 컴파운드 내부에서
4. **면책 고지 삭제 금지** — 증상 결과 화면의 수의사 고지 항상 표시

## 디자인 핸드오프 위치
```
docs/design_handoff_daengdaeng_care/
  01_DESIGN_TOKENS.md     ← 토큰 (원본)
  02_COMPONENTS.md        ← 컴포넌트 명세
  03_SCREENS.md           ← 16개 화면
  04_INTERACTIONS_AND_RULES.md
  reference/daeng/        ← HTML/JSX 프로토타입 (재현 기준)
```

## 패키지 구조
```
packages/tokens    ← 디자인 토큰 TS
packages/ui        ← 컴포넌트 라이브러리 (Vite + Storybook)
packages/constants ← 음식 DB, 증상 트리
apps/mobile        ← Expo RN 앱
apps/web           ← Next.js 랜딩
```

## 개발 순서
tokens → atoms → molecules → compound → mobile screens → web

## Skills
```
/create-component [atom|molecule|compound] [Name]  ← 컴포넌트 스캐폴딩
/pr                                                ← PR 자동 생성
/gitflow [feature|fix|chore] [name]               ← 브랜치 생성
/check-rules                                       ← 규칙 위반 검사
```

## GitFlow
- `main` → 프로덕션
- `dev` → 통합 브랜치
- `feature/*` → 기능 개발
- PR은 항상 `dev` 으로

## 하네스 파트 가이드
```
docs/harness/PRODUCT.md   docs/harness/QA.md
docs/harness/DESIGN.md    docs/harness/FRONTEND.md
docs/harness/BACKEND.md   docs/harness/INFRA.md
```
