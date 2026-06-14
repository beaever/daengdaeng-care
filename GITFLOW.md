# 댕댕케어 — GitFlow 전략

## 브랜치 구조

```
main          ← 프로덕션 (App Store 제출 기준)
  └─ develop  ← 통합 브랜치 (다음 릴리스 대상)
       ├─ feature/f001-food-checker
       ├─ feature/f002-ingredient-analyzer
       ├─ fix/storybook-dark-mode-token
       └─ chore/ci-chromatic-setup
```

---

## 브랜치 명명 규칙

```bash
# 기능 개발
feature/{기능ID}-{짧은-설명}
feature/f001-food-checker
feature/ui-button-atom
feature/compound-food-result

# 버그 수정
fix/{짧은-설명}
fix/emergency-ad-leak
fix/dark-mode-card-text

# 인프라/도구
chore/{짧은-설명}
chore/ci-setup
chore/chromatic-token

# 릴리스
release/v1.0.0
```

---

## 작업 흐름

### 새 기능 시작
```bash
git checkout develop
git pull origin develop
git checkout -b feature/f001-food-checker
```

### 작업 중 커밋
```bash
git add packages/ui/src/atoms/Button/
git commit -m "feat(ui): Button 아톰 컴포넌트 구현"
```

### PR 생성 (자동화)
```bash
# Claude Code skill 사용 — /pr 입력 시 자동으로:
# 1. develop 브랜치 기준 PR 생성
# 2. PR 템플릿 자동 채움
# 3. Chromatic 링크 포함
```

### PR 머지 조건
- [ ] CI 통과 (type-check + lint + test)
- [ ] Chromatic 승인 (UI 변경 있을 경우)
- [ ] 하네스 체크리스트 완료

---

## 커밋 타입

| 타입 | 설명 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `test` | 테스트 추가/수정 |
| `docs` | 문서 변경 |
| `chore` | 빌드/도구/설정 변경 |
| `style` | 코드 포맷 (로직 변경 없음) |

---

## 릴리스 흐름

```bash
# 1. release 브랜치 생성
git checkout develop
git checkout -b release/v1.0.0

# 2. 버전 업데이트, 릴리스 노트 작성
# 3. main 머지 + 태그
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "v1.0.0 - 댕댕케어 첫 출시"

# 4. develop 역머지
git checkout develop
git merge main

# 5. EAS Submit
eas submit --platform ios
```

---

## 핫픽스 (프로덕션 긴급 패치)

```bash
git checkout main
git checkout -b fix/critical-emergency-ad-bug
# 수정 후
git checkout main && git merge fix/critical-emergency-ad-bug
git checkout develop && git merge fix/critical-emergency-ad-bug
```

---

## Git 훅 (선택 설치)

```bash
# 커밋 전 자동 type-check + lint
# .husky/pre-commit
pnpm type-check && pnpm lint
```
