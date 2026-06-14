---
name: create-component
description: 댕댕케어 컴포넌트 스캐폴딩 — Atom/Molecule/Compound 선택 후 파일 자동 생성
---

# /create-component 사용법

```
/create-component [type] [ComponentName]

예:
/create-component atom Input
/create-component molecule Note
/create-component compound HealthRecord
```

## 실행 시 생성되는 파일

### Atom / Molecule
```
packages/ui/src/{atoms|molecules}/{ComponentName}/
  {ComponentName}.tsx
  {ComponentName}.module.css
  {ComponentName}.stories.tsx
  index.ts
```

### Compound
```
packages/ui/src/compound/{ComponentName}/
  {ComponentName}.tsx        ← createContext + Object.assign 패턴
  {ComponentName}.module.css
  {ComponentName}.stories.tsx
  index.ts
```

## 필수 패턴 — Compound Component

```tsx
// Root에 Context 생성
const Ctx = createContext<{...} | null>(null);
function useCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('{ComponentName} sub-component used outside <{ComponentName}>');
  return ctx;
}

// Sub-component 정의 후
export const {ComponentName} = Object.assign({ComponentName}Root, {
  SubA,
  SubB,
});
```

## 체크리스트 (생성 후 확인)
- [ ] 모든 색상이 CSS 변수 (`var(--brand)`) 사용
- [ ] `word-break: keep-all` 한글 텍스트에 적용
- [ ] Story에 라이트/다크 variant 포함
- [ ] index.ts에서 export
- [ ] packages/ui/src/index.ts에 추가
