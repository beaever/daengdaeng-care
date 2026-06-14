---
name: check-rules
description: RULES.md 기준으로 현재 변경사항이 규칙을 위반하는지 검사한다
---

# /check-rules 사용법

```
/check-rules
/check-rules src/compound/SymptomResult.tsx
```

## 검사 항목

### 🔴 절대 규칙 (위반 시 즉시 차단)
1. **응급 화면 광고** — emergency 레벨에서 AdBanner/NativeAd 렌더 여부
2. **하드코딩 색상** — `#[0-9A-Fa-f]{6}` 패턴이 CSS/TSX에 있는지
3. **API Key 노출** — 코드에 실제 키 값이 포함됐는지
4. **면책 고지 삭제** — 증상 결과에 Disclaimer가 있는지

### 🟡 권고 규칙
5. **터치 타깃** — 인터랙티브 요소 min-height 44px 이하
6. **word-break** — 한글 텍스트 영역에 keep-all 누락
7. **광고 사전 예약** — AdBanner 높이 52px 고정 여부
8. **Story 파일 누락** — 새 컴포넌트에 .stories.tsx 없음

## 결과 형식
```
✅ 응급 화면 광고: 없음
❌ 하드코딩 색상: Button.module.css:12 (#F59E0B → var(--brand) 사용)
⚠️  터치 타깃: IconButton 40px (44px 이상 권장)
```
