# Design — 댕댕케어 하네스 가이드

## 역할 범위
Design은 **디자인 토큰의 단일 출처**를 소유한다. 모든 시각적 결정은 여기서 시작된다.

---

## 핵심 원칙

1. **토큰이 단일 출처** — `packages/tokens/src/index.ts` 와 `packages/ui/src/styles/tokens.css` 를 기준으로 한다. 컴포넌트에 hex/숫자 하드코딩 절대 금지
2. **안전도 색 = 신뢰** — safe/caution/danger/emergency 색은 앱의 핵심 신뢰 지표. 브랜드색과 절대 혼용하지 않는다
3. **다크모드 동등** — 라이트모드와 동일한 수준의 QA를 다크모드에서 수행한다
4. **SUIT 폰트 우선** — 한글 가독성 1순위. 폴백: Apple SD Gothic Neo → Pretendard

---

## 디자인 핸드오프 구조

```
docs/design_handoff_daengdaeng_care/
├── 01_DESIGN_TOKENS.md     ← 토큰 정의 (원본)
├── 02_COMPONENTS.md        ← 컴포넌트 명세
├── 03_SCREENS.md           ← 16개 화면 명세
├── 04_INTERACTIONS_AND_RULES.md ← 인터랙션·광고·규칙
└── reference/daeng/        ← HTML/JSX 프로토타입 (재현 기준)
```

---

## 컴포넌트 추가 시 Design 체크리스트

- [ ] 토큰(`--brand`, `--text`, `--surface` 등)만 사용, raw hex 없음
- [ ] 라이트/다크 Story 둘 다 스냅샷 확인
- [ ] 터치 타깃 최소 44px 확인
- [ ] 한글 `word-break: keep-all` 적용
- [ ] `prefers-reduced-motion` 대응 (모션 줄이기 시 애니메이션 스킵)
- [ ] [AD] 라벨이 있는 광고 컴포넌트는 응급 화면 외에만 렌더

---

## 컬러 사용 규칙

| 용도 | 사용 토큰 | 금지 |
|------|-----------|------|
| 버튼/강조 | `--brand`, `--brand-press` | 직접 `#F59E0B` |
| 결과 배지 | `--safe`, `--caution`, `--danger` | 브랜드색 대체 |
| 본문 | `--text`, `--text-2`, `--text-3` | `#1F1B13` 직접 |
| 배경 | `--bg`, `--surface`, `--surface-2` | `#FFFDF9` 직접 |
| 다크모드 | 동일 토큰 (자동 전환) | 다크 전용 hex 하드코딩 |

---

## Storybook 운영 규칙

- Story 파일명: `ComponentName.stories.tsx`
- 기본 Story 이름: 가장 흔한 사용 케이스
- `autodocs` 태그 필수 (컴포넌트 문서 자동 생성)
- Chromatic 승인 없이 디자인 변경 PR 머지 불가
