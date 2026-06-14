---
name: pr
description: 현재 브랜치에서 develop을 base로 PR을 자동 생성한다
---

# /pr 사용법

```
/pr
/pr "선택적 PR 제목 직접 지정"
```

## 실행 흐름

1. 현재 브랜치 이름과 최근 커밋 목록 확인
2. 변경된 파일 목록으로 파트 자동 판단 (ui/compound/apps...)
3. PR 제목 자동 생성: `[파트] 변경 내용 요약`
4. PR 본문: `.github/pull_request_template.md` 기반 자동 채움
5. `gh pr create` 실행

## PR 제목 규칙
```
[Frontend] FoodResult 컴파운드 컴포넌트 구현
[QA] 음식 검색 함수 테스트 추가
[Infra] Chromatic CI 워크플로우 설정
[Design] Button 다크모드 토큰 수정
```

## Base 브랜치 규칙
- 기능/수정 브랜치 → `develop`
- `develop` → `main` (릴리스 시에만)

## 주의
- PR 생성 전 `pnpm type-check && pnpm lint` 자동 실행
- 실패 시 PR 생성 중단 + 에러 안내
