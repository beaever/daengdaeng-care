# Infra — 댕댕케어 하네스 가이드

## 역할 범위
Infra는 **CI/CD 파이프라인, 배포 환경, 비용 관리**를 소유한다.

---

## 인프라 구성 (v1.0 목표: 월 $0)

| 서비스 | 용도 | 비용 |
|--------|------|------|
| GitHub Actions | CI (lint/type-check/test/chromatic) | 무료 (2000분/월) |
| Chromatic | 시각 테스트 | 무료 (5000 스냅샷/월) |
| EAS Build | iOS 앱 빌드 | 무료 (15빌드/월) |
| Vercel | Next.js 랜딩페이지 | 무료 |
| Apple Developer | App Store 배포 | $99/년 |
| AdMob | 광고 수익화 (v1.0 미적용, MAU 이후) | 무료 (수익 발생) |

---

## CI 파이프라인 (`.github/workflows/ci.yml`)

```
PR 오픈/업데이트 시 자동 실행:
1. pnpm install
2. turbo type-check
3. turbo lint
4. turbo test
5. turbo build (패키지만, 앱 빌드 제외)
6. Chromatic (storybook 빌드 → 스냅샷 비교)
```

모든 체크 통과 시에만 머지 가능 (Branch Protection 필수 설정)

---

## Chromatic 설정

```bash
# .env.local (GitHub Secret으로 관리)
CHROMATIC_PROJECT_TOKEN=your_chromatic_token

# PR마다 자동으로 시각 변경 감지
# 디자인 변경 있을 경우 팀이 Chromatic UI에서 승인/거부
```

---

## EAS Build 설정

```json
// apps/mobile/eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "production": {
      "ios": { "buildConfiguration": "Release" }
    }
  }
}
```

### 빌드 트리거 규칙
- `main` 브랜치 머지 → preview 빌드 자동 트리거
- App Store 제출: 수동 (`eas submit`)
- EAS 무료 15빌드/월 준수 — 불필요한 빌드 금지

---

## Branch Protection 설정 (GitHub)

`main` 브랜치:
- [x] Require pull request before merging
- [x] Require status checks: `ci`, `chromatic`
- [x] Require branches to be up to date
- [x] Restrict direct pushes

---

## 비용 모니터링

```
월별 체크 항목:
- EAS Build 사용량 (15빌드 한도)
- Chromatic 스냅샷 수 (5000 한도)
- Kakao Local API 호출수 (3,000,000 한도)
- GitHub Actions 분 (2000분 한도)
```

---

## 환경 분리

| 환경 | 브랜치 | 빌드 | 광고 |
|------|--------|------|------|
| 개발 | `feature/*` | development | 테스트 광고 ID |
| 스테이징 | `dev` | preview | 테스트 광고 ID |
| 프로덕션 | `main` | production | 실제 AdMob ID |

---

## 알려진 제약

### expo-doctor React 중복 경고 (T0.1, 2026-09-27)
- `apps/mobile` 은 React 19 (Expo SDK 57), `apps/web`·`packages/ui` 는 React 18 을 쓴다.
- `node-linker=hoisted` 단일 node_modules 에서 두 버전이 공존하므로 `expo-doctor` 의 "no duplicate dependencies" 체크(21개 중 1개)는 항상 실패한다. **이 1건은 허용한다.**
- 루트 `package.json` 의 `react: 18.3.1` 고정 → web/ui 는 루트 React 18 하나만 사용
- `apps/mobile/metro.config.js` 의 `extraNodeModules` → 모바일 번들은 React 19 하나만 사용 (`expo export` 번들 검증 완료)
- 해소 조건: web/ui 를 React 19 (Next 15) 로 올리면 루트 고정과 이 예외를 함께 제거한다.

## PR 체크리스트 (Infra)

- [ ] CI 워크플로우가 통과됨
- [ ] 환경 변수가 Secret으로 관리됨 (코드 내 노출 없음)
- [ ] EAS 빌드 예산 확인 (월 15빌드 미초과)
- [ ] Chromatic 스냅샷 승인됨
