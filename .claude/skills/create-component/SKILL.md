---
name: create-component
description: 댕댕케어 모바일(RN) 컴포넌트 스캐폴딩 — ui(atom/molecule) 또는 compound 를 apps/mobile/components 에 생성한다
---

# /create-component [ui|compound] [ComponentName]

```
/create-component ui Toggle
/create-component compound PetEditor
```

> v1.0은 iOS 앱 전용이다. 앱은 `apps/mobile/components` 만 사용한다. `packages/ui`(웹·Storybook)는 동결 상태이므로 여기에 생성하지 않는다.

## 생성 위치
```
apps/mobile/components/ui/{ComponentName}.tsx         ← ui
apps/mobile/components/compound/{ComponentName}.tsx   ← compound
```
생성 후 같은 폴더의 `index.ts` 에 export를 추가한다.

## 먼저 할 일
같은 폴더의 기존 컴포넌트 하나(ui는 `Badge.tsx`, compound는 `SymptomResult.tsx`)를 읽고 import 경로, `StyleSheet.create`, theme 사용법을 그대로 따른다.

## Compound 패턴
```tsx
const Ctx = createContext<{...} | null>(null);
function useCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('{ComponentName} sub-component used outside <{ComponentName}>');
  return ctx;
}
export const {ComponentName} = Object.assign({ComponentName}Root, { SubA, SubB });
```
레벨(safe/caution/danger/emergency) 분기는 컴파운드 내부에서 한다.

## 체크리스트
- [ ] 색·간격·폰트는 `theme.ts` 에서만 사용 (hex 금지)
- [ ] 인터랙티브 요소 44pt 이상, `accessibilityLabel`
- [ ] Props는 interface로 export
- [ ] `index.ts` export 추가
