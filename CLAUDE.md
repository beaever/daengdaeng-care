# 댕댕케어 — Claude Code 가이드

## 프로젝트 개요
반려견 건강 관리 앱 (iOS). 음식 판별·사료 분석·증상 체크·병원 찾기·건강 기록 5가지 기능.
**v1.0 = iOS 전용 · 광고 없음.** 진행 계획: `docs/IOS_RELEASE_PLAN.md`
React Native + Expo + TypeScript + pnpm + Turborepo 모노레포.

## 핵심 규칙 (RULES.md 전문 참고)

1. **응급 화면에 절대 광고 없음** — emergency 레벨에서 AdBanner/NativeAd 렌더 금지 (v1.0은 광고 자체가 없음)
2. **토큰 단일 출처** — hex 하드코딩 금지. 앱은 `theme.ts`, 웹은 `var(--brand)` 등 CSS 변수 사용
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
packages/ui        ← 웹 컴포넌트 (Vite + Storybook) — 동결, 앱에서 사용 안 함
packages/constants ← 음식 DB, 증상 트리 (앱 데이터 단일 출처)
apps/mobile        ← Expo RN 앱 (components/ui, components/compound 가 앱 컴포넌트)
apps/web           ← Next.js 랜딩
```

## 개발 순서
`docs/IOS_RELEASE_PLAN.md` 의 Phase 0 → 3 태스크 순서를 따른다.

## Skills (`.claude/skills/<name>/SKILL.md`)
```
/harness <태스크ID>                                 ← 계획서 태스크를 에이전트 파이프라인으로 실행 → PR
/ios-release [preflight|testflight|submit]         ← iOS 릴리스 점검·빌드·제출
/create-component [ui|compound] [Name]             ← RN 컴포넌트 스캐폴딩
/pr                                                ← dev 대상 PR 생성 후 dev 복귀
/gitflow [feature|fix|chore|release] [name]       ← 브랜치 생성
/check-rules [경로]                                ← 규칙 위반 검사 (rules-guard)
```

## Subagents (`.claude/agents/`)
| 에이전트 | 모델 | 파트 | 용도 |
|---|---|---|---|
| planner | opus | PRODUCT | 태스크 분해·범위·심사 리스크 (읽기 전용) |
| mobile-engineer | sonnet | FRONTEND·DESIGN | apps/mobile 화면·컴포넌트, apps/web |
| data-engineer | sonnet | BACKEND | SQLite·외부 API·권한·에러 처리 |
| release-engineer | sonnet | INFRA | Expo SDK·EAS·Info.plist·App Store |
| qa-engineer | sonnet | QA | 테스트 작성·품질 게이트 판정 |
| rules-guard | haiku | RULES | 규칙 위반 빠른 검사 (읽기 전용) |

판단이 필요한 계획은 opus, 코드 작성은 sonnet, 패턴 검사는 haiku로 나눈다.

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
