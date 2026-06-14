# 04 · 인터랙션 · 규칙 · 안전영역

---

## 1. 인터랙션 톤
> "부드러운 iOS 네이티브 느낌 + 절제된 포인트 인터랙션"

- **전환**: 탭 스택 push/pop은 플랫폼 기본 전환(iOS 슬라이드, Android fade-through)
- **press 피드백**: 모든 탭 가능 요소 `scale(.97~.92)` 120ms (`ease-out`)
- **포인트 모션** (`ease-spring` = `cubic-bezier(.34,1.56,.64,1)`):
  - Segment thumb 슬라이드
  - Option 체크 원 pop
  - 스플래시 로고 pop
  - FAB press
- **루프 애니메이션**: 사료 스캔 레이저 라인(상하 2.2s 무한)만. 그 외 콘텐츠에 무한 루프 금지
- **진행 표시**: 증상 질문 ProgressBar는 width를 `ease-out`으로 채움
- `prefers-reduced-motion` 존중 — 모션 줄이기 설정 시 진입 애니메이션 생략, 결과는 최종 상태로

## 2. 문구 (Copywriting) 톤
> "명확하고 캐주얼하게" — 보호자에게 말 걸듯, 단정적이되 다정하게

- 질문형 타이틀: "이거 먹어도 될까요?", "어디가 안 좋아 보이나요?", "병원 가야 할까?"
- 결과는 행동 중심: "절대 안 돼요", "오늘 안에 병원에 가보세요", "지금 당장 급하진 않아요"
- 1인칭/공감: "{이름} 보호자님", "우리 아이"
- 전문용어는 풀어서: 성분명 뒤 괄호 설명, 증상은 일상어로

## 3. 광고 규칙 (수익화) — ⚠️ 중요
| 위치 | 광고 |
|---|---|
| 음식 결과 하단 | AdBanner |
| 사료 분석 결과 하단 | AdBanner |
| 병원 목록 3번째 항목 | NativeAd |
| 증상 질문→비응급 결과 사이 | 전면(인터스티셜), 5초 후 스킵 |
| 증상 결과(비응급) 하단 | AdBanner |
| 건강 기록 하단 | AdBanner |

- **모든 광고에 `[AD]` 라벨 필수**
- **🚨 응급(emergency) 플로우에는 어떤 광고도 노출 금지** — 응급 증상 배너 직행, 전면광고 건너뜀, 결과 하단 배너 없음. 생명과 직결되므로 절대 규칙
- 광고 배너는 **52px(50pt) 고정 높이로 레이아웃에 미리 자리 예약** → 로드 전후 레이아웃 점프 방지

## 4. 면책 (Disclaimer)
- 증상 결과에 항상 Note: "이 결과는 참고용이며 수의사의 진단을 대신하지 않아요." 제거 금지

## 5. 안전영역 · 크로스플랫폼 (iOS · Android 동시 배포)
- **타깃 폭**: iPhone 390–402pt / Android 360–412dp. 이 범위에서 깨지지 않게 (가장 좁은 360dp 기준으로 테스트)
- **상단**: 노치/다이나믹 아일랜드/펀치홀 피해 safe-area-inset-top 적용 (헤더가 상태바와 겹치지 않게)
- **하단**: 홈 인디케이터/제스처 바 피해 safe-area-inset-bottom. **탭바는 디바이스 최하단에 붙지 않고 여유 inset** (iOS 34 / Android 12)
- **터치 타깃**: 최소 44px(iOS) / 48dp(Android)
- **다크모드**: 시스템 설정 연동. 모든 색은 테마 토큰 경유 (고정 hex 금지)
- 폰트 스케일(접근성 큰 글씨) 대응 권장 — 레이아웃은 줄바꿈 허용, 고정 높이 텍스트 영역 지양

## 6. 상태 관리 정리
화면별 로컬/전역 상태(프로토타입의 `ui` 객체 기준):
| 상태 | 화면 | 비고 |
|---|---|---|
| pet 프로필 | 전역 | 이름/품종/나이/성별/중성화/체중/사진 |
| onbIdx | 온보딩 | |
| pfName/pfBreed/pfSex/pfNeu | 프로필 등록 | 저장 시 pet으로 |
| foodQuery / foodResult | 음식 | 검색어 / 결과 음식명 |
| symptomIdx / symptomVerdict | 증상 | 질문 인덱스 / 판정(emergency·today·watch) |
| hospView / selectedHospital | 병원 | 지도·목록 / 선택 병원 id |
| recTab | 기록 | all·vaccine·weight·vet |
| addType | 기록 추가 | vaccine·weight·vet |
| theme | 전역 | light·dark (시스템 연동) |

- 최초 실행 플래그(온보딩·프로필 완료 여부)는 영구 저장(AsyncStorage/UserDefaults 등)
- 음식 DB·증상 트리·병원·기록은 현재 목업(`data.js`). 실제 구현 시 API/로컬DB로 교체 — 데이터 형태는 `data.js` 스키마 참고

## 7. 데이터 스키마 (data.js 발췌)
```
food:   { name, level:'safe|caution|danger', reason, serve?, ingredient?,
          symptoms?:[], nutrition?:[], related?:[] }
product:{ name, brand, grade:'A|B|C|D', gradeLabel,
          ingredients:[{rank,name,status}], warnings:[{name,status,note}] }
symptomQuestion: { q, options:[{ label, next?:idx, verdict?:'emergency|today|watch' }] }
symptomResult:   { level, title, reason, actions:[], watchList?:[], hospital:bool }
hospital:{ id, name, dist, open:bool, is24h:bool, hours, phone, addr }
record:  { id, type:'vaccine|weight|vet', date, title, sub }
```
