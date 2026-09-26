---
name: gitflow
description: GitFlow 브랜치 작업을 가이드하고 자동으로 브랜치를 생성한다
---

# /gitflow 사용법

```
/gitflow feature f001-food-checker
/gitflow fix emergency-ad-leak
/gitflow chore chromatic-setup
/gitflow release v1.0.0
```

## 실행 흐름

### feature/fix/chore
```bash
git checkout dev
git pull origin dev
git checkout -b {type}/{name}
```

### release
```bash
git checkout dev
git pull origin dev
git checkout -b release/{version}
# → 버전 업데이트 안내 후 main 머지 플로우 가이드
```

## 브랜치 네이밍 검증
- feature: `feature/f001-food-checker` (소문자, 하이픈)
- fix: `fix/emergency-ad-bug`
- chore: `chore/ci-workflow`
- release: `release/v1.0.0`

## 작업 완료 후
```
/pr 로 PR 자동 생성
```
