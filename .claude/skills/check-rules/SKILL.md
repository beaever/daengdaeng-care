---
name: check-rules
description: RULES.md 기준으로 현재 변경사항(또는 지정 경로)이 규칙을 위반하는지 rules-guard 에이전트(haiku)로 검사한다
---

# /check-rules [경로]

```
/check-rules                                   ← dev 대비 변경 파일
/check-rules apps/mobile/components/compound   ← 지정 경로
```

`rules-guard` 서브에이전트에 인자(경로)를 그대로 넘기고, 받은 결과를 그대로 보고한다. 검사 항목과 출력 형식은 `.claude/agents/rules-guard.md` 가 단일 출처다.

🔴 위반이 있으면 "차단"으로 보고하고, 수정은 사용자가 요청할 때만 한다.
