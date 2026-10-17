# 댕댕케어 — 엔지니어링 룰 (RULES)

> 이 파일이 모든 하네스 파트의 상위 규칙이다. 파트별 규칙과 충돌 시 이 파일이 우선한다.

---

## 🔴 절대 규칙 (NEVER BREAK)

### 1. 응급 화면 무광고
```
emergency 레벨 화면에는 어떤 광고도 렌더하지 않는다.
AdBanner, NativeAd, 인터스티셜 전부 금지.
생명과 직결되므로 예외 없음.
```

### 2. 토큰 단일 출처
```
색상·간격·폰트 크기를 컴포넌트 코드에 하드코딩하지 않는다.
packages/tokens/src/index.ts 와 CSS 변수(var(--brand) 등)만 사용.
```

### 3. Compound 패턴 준수
```
화면은 Compound Component를 조립하는 방식으로만 만든다.
FoodResult, SymptomChecker 등 내부 로직은 컴파운드 안에 캡슐화한다.
화면 레벨에서 level === 'danger' 같은 분기를 하지 않는다.
```

### 4. 면책 고지 삭제 금지
```
증상 체크 결과 화면의 면책 고지를 삭제하거나 숨기지 않는다:
"이 결과는 참고용이며 수의사의 진단을 대신하지 않아요."
```

### 5. API Key 노출 금지
```
Kakao API Key 등 민감 정보는 반드시 환경 변수로 관리.
코드, PR, 커밋 메시지에 직접 포함 금지.
```

---

## 🟡 강한 권고 (STRONGLY RECOMMENDED)

### 광고 52px 사전 예약
```
AdBanner가 로드되기 전에도 52px 공간을 미리 확보한다.
로드 전/후 레이아웃 점프 방지.
```

### 한글 줄바꿈
```
word-break: keep-all 을 모든 한글 텍스트 영역에 적용한다.
단어 중간 줄바꿈으로 인한 가독성 저하 방지.
```

### 최소 터치 타깃
```
모든 인터랙티브 요소의 최소 높이/너비: 44px (iOS 기준).
```

### 다크모드 대응
```
시스템 다크모드 설정을 반드시 존중한다.
테마 토큰을 사용하면 자동으로 대응된다.
```

### Safe Area
```
노치·다이나믹 아일랜드·홈 인디케이터 영역을 침범하지 않는다.
```

---

## 📐 코드 규칙

### TypeScript
- `strict: true` 필수. any 타입 원칙적 금지
- 컴포넌트 Props는 interface로 export
- 파일당 하나의 주요 export

### 파일 구조
```
apps/mobile/components/
  ui/ComponentName.tsx        ← 아톰·몰리큘 (StyleSheet + theme.ts 토큰)
  compound/ComponentName.tsx  ← 컴파운드 (레벨 분기는 내부에서)
  ui/index.ts, compound/index.ts ← re-export
```

### 커밋 메시지
```
feat(ui): Button 컴포넌트 추가
fix(compound): FoodResult 다크모드 토큰 수정
chore(infra): CI 워크플로우 업데이트
test(constants): 음식 검색 함수 테스트 추가
docs(harness): Frontend 가이드 업데이트
```

### PR 제목 형식
```
[파트] 변경 내용 요약 (50자 이내)
예: [Frontend] FoodResult 컴파운드 컴포넌트 구현
```

---

## 🏗️ 개발 진행 순서

```
1. 토큰 (packages/tokens)
2. 아톰·몰리큘 (apps/mobile/components/ui)
3. 컴파운드 (apps/mobile/components/compound)
4. 모바일 화면 (apps/mobile/app)
5. 랜딩페이지 (apps/web)
```
