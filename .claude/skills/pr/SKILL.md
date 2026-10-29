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
5. **스크린샷 (필수 — PR이 개발 히스토리로 남는다)**: 변경이 조금이라도 있으면 무엇이 어떻게 바뀌었는지 보이는 화면을 찍는다.
   - 시뮬레이터 Release 빌드(`CI=1 npx expo run:ios --configuration Release --no-bundler`)에서 캡처. 화면 조작은 Maestro, 캡처는 `xcrun simctl io booted screenshot`
   - UI 변경은 수정 전/후를 같은 화면으로 비교한다 (수정 전은 고치기 전에 찍어 둔다). 동작·로직 변경은 그 결과가 보이는 화면을 찍는다
   - 화면이 없는 변경(설정·테스트·문서)은 터미널 출력·diff 등 확인 결과를 캡처하거나 본문에 그대로 붙인다
   - 업로드: 고아 브랜치 `pr-assets` 의 `<PR번호>/` 에 push (git worktree 사용) → 본문에 `<img src="https://raw.githubusercontent.com/beaever/daengdaeng-care/pr-assets/<PR번호>/<파일>.png" width="240">` 표로 넣는다
6. 본문: `.github/pull_request_template.md` 를 채운다. 계획서 태스크면 "머지 후 `docs/IOS_RELEASE_PLAN.md` 의 <ID> 체크"를 적는다. 스크린샷 섹션을 글로만 채우지 않는다.
7. `git push -u origin <브랜치>` → `gh pr create --base dev` → PR 번호로 5번 이미지를 올리고 `gh pr edit --body-file` 로 본문을 갱신한다.
8. `git checkout dev` 로 돌아와 PR URL을 보고한다.

## Base 브랜치 규칙
- 기능/수정 브랜치 → `dev`
- `dev` → `main` 은 릴리스 때만 (`/gitflow release`)
