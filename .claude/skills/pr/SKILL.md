---
name: pr
description: 현재 브랜치에서 dev를 base로 PR을 자동 생성하고 dev로 돌아온다
---

# /pr ["PR 제목"]

## 실행 흐름
1. 현재 브랜치가 `dev`/`main` 이면 멈춘다.
2. 루트에서 `pnpm type-check && pnpm lint && pnpm test` 실행. 실패하면 PR을 만들지 않고 에러를 보고한다.
3. `git log dev..HEAD` 와 `git diff --stat dev...HEAD` 로 변경 내용을 파악한다.
4. 제목: `[파트] 변경 요약` (파트: Frontend / Backend / Infra / QA / Design / Product / Harness). 계획서 태스크면 앞에 `T0.2` 처럼 ID를 붙인다.
5. 본문: `.github/pull_request_template.md` 를 채운다. 계획서 태스크면 "머지 후 `docs/IOS_RELEASE_PLAN.md` 의 <ID> 체크"를 적는다.
6. `git push -u origin <브랜치>` → `gh pr create --base dev`
7. `git checkout dev` 로 돌아와 PR URL을 보고한다.

## Base 브랜치 규칙
- 기능/수정 브랜치 → `dev`
- `dev` → `main` 은 릴리스 때만 (`/gitflow release`)
