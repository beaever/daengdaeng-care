---
name: harness
description: docs/IOS_RELEASE_PLAN.md 의 태스크 하나를 하네스 파이프라인(planner → 구현 에이전트 → qa-engineer → rules-guard → PR)으로 끝까지 실행한다. 사용 예: /harness T0.2
---

# /harness <태스크ID>

계획서의 태스크 하나를 브랜치 하나, PR 하나로 끝낸다. 각 단계는 해당 서브에이전트(`.claude/agents/`)에 맡기고, 메인 세션은 조율과 사용자 보고만 한다.

## 파이프라인

1. **확인**
   - `docs/IOS_RELEASE_PLAN.md` 에서 `<태스크ID>` 섹션을 찾는다. 없거나 이미 체크되었으면 멈추고 알린다.
   - 선행 태스크(실행 순서 요약)가 체크되지 않았으면 경고하고 진행 여부를 묻는다.
2. **계획** → `planner` (opus)
   - 태스크 섹션 전문을 넘기고 실행 계획을 받는다.
   - "결정 필요"가 있으면 사용자에게 AskUserQuestion으로 묻고 진행한다.
3. **브랜치** → `/gitflow <type> <name>` (계획의 브랜치명 사용, dev 기준)
4. **구현** → 계획의 담당 에이전트
   - `mobile-engineer` / `data-engineer` / `release-engineer` (모두 sonnet)
   - 서로 다른 파일을 다루는 단계는 병렬로 실행하고, 의존 관계가 있으면 순서대로 실행한다.
   - 각 에이전트에게 계획 전문과 자기 단계를 넘긴다.
5. **검증** → `qa-engineer` (sonnet)
   - 게이트가 ❌이면 실패 내용을 담당 구현 에이전트에게 다시 넘긴다. **최대 2회** 반복하고, 그래도 실패하면 멈추고 사용자에게 보고한다.
6. **규칙** → `rules-guard` (haiku)
   - 🔴 위반이 있으면 구현 에이전트가 고친 뒤 5단계부터 다시 한다.
7. **마무리**
   - 한국어 커밋 (Co-Authored-By 트레일러 포함), 계획서의 해당 체크박스는 **PR 본문의 "머지 후 체크"** 로만 안내한다 (머지 전에 체크하지 않는다).
   - `/pr` 로 dev 대상 PR을 만들고 dev로 돌아온다.

## 사용자 보고 형식
```
T0.2 광고 코드 제거 — PR #NN
구현: mobile-engineer (파일 N개)
게이트: type-check ✅ lint ✅ test ✅ · 규칙 ✅
수동 확인 필요: (시뮬레이터/실기기 항목)
```

## 하지 않는 것
- 태스크 범위 밖의 수정 (발견하면 계획서에 새 태스크로 제안만)
- `eas build`/`eas submit` 자동 실행 → `/ios-release` 에서 사용자 확인 후
