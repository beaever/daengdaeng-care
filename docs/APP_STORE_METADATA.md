# App Store Connect 입력값 — 댕댕케어 v1.0

T3.3(App Privacy·연령 등급)·T3.4(메타데이터) 에서 App Store Connect 에 그대로 붙여 넣는다.
앱 동작이 바뀌면 이 문서와 `apps/web/app/privacy/page.tsx` 를 함께 고친다.

## 1. 앱 정보

| 항목 | 값 |
|---|---|
| 이름 (30자) | 댕댕케어 |
| 부제 (30자) | 강아지 음식·증상·병원 한 번에 |
| 기본 카테고리 | 라이프스타일 |
| 보조 카테고리 | 건강 및 피트니스 (선택, 비워도 됨) |
| 가격 | 무료 |
| 개인정보처리방침 URL | https://daengdaeng-care.pages.dev/privacy |
| 지원 URL | https://daengdaeng-care.pages.dev/support |
| 마케팅 URL (선택) | https://daengdaeng-care.pages.dev |
| 저작권 | © 2026 댕댕케어 |

> 의료 카테고리는 심사가 엄격하므로 쓰지 않는다 (계획서 T3.4).

## 2. 홍보 문구 (170자, 심사 없이 수정 가능)

포도 한 알도 위험할 수 있어요. 먹어도 되는 음식인지, 병원에 가야 할 증상인지, 가장 가까운 동물병원이 어디인지 — 우리 아이 건강 궁금증을 한 앱에서 확인하세요.

## 3. 설명 (4000자)

```
우리 아이 건강, 이 앱 하나로 안심.
댕댕케어는 반려견 보호자의 매일 궁금증을 빠르게 해결해 주는 건강 관리 앱이에요. 회원가입도, 광고도 없어요.

■ 음식 판별 — 이거 먹어도 돼?
포도, 초콜릿, 양파, 자일리톨처럼 강아지에게 위험한 음식부터 사과, 당근, 고구마처럼 줘도 되는 음식까지.
음식 이름을 검색하면 안전 · 주의 · 위험으로 바로 알려드리고, 먹었을 때 나타날 수 있는 증상과 급여 방법도 안내해요.

■ 증상 체크 — 병원 가야 할까?
구토·호흡기·움직임·피부·행동 변화 같은 증상 분류를 고르고 몇 가지 질문에 답하면
지금 바로 병원에 가야 하는지, 오늘 안에 진료를 받으면 되는지, 집에서 지켜봐도 되는지 판단을 도와드려요.
응급으로 보이면 가까운 동물병원 찾기로 바로 연결돼요.

■ 병원 찾기 — 급할 때 가까운 동물병원
현재 위치 주변 동물병원을 거리순으로 보여드려요. 지도와 목록으로 보고, 바로 전화하거나 길찾기를 시작할 수 있어요.
위치 권한 없이도 지역명으로 검색할 수 있어요.

■ 건강 기록 — 체중 · 예방접종 · 병원 방문
우리 아이 건강 다이어리. 체중 변화와 접종 기록을 남기고, 다음 예방접종일까지 남은 날을 홈에서 확인하세요.

■ 내 정보는 내 기기에만
반려견 프로필과 건강 기록은 기기 안에만 저장돼요. 서버로 보내지 않아요.

※ 댕댕케어가 제공하는 정보는 참고용이며 수의사의 진단을 대신하지 않습니다. 이상 증상이 있거나 응급 상황으로 의심되면 즉시 동물병원에 방문하세요.
```

## 4. 키워드 (100자, 쉼표 구분·공백 없이)

```
강아지,반려견,애견,반려동물,동물병원,강아지음식,먹어도되는음식,증상,예방접종,체중,건강기록,펫,댕댕이,포도,초콜릿
```

> 앱 이름·카테고리에 이미 있는 단어("댕댕케어", "라이프스타일")는 넣지 않는다. 경쟁 앱 이름·상표는 넣지 않는다 (2.3.7).

## 5. 스크린샷 (6.9인치 필수: 1320×2868 또는 1290×2796)

시뮬레이터 `iPhone 16 Pro Max` 에서 `xcrun simctl io booted screenshot` 으로 촬영. 순서:
1. 홈 (프로필 카드 · 바로가기 · 건강 요약)
2. 음식 결과 — 포도 "절대 안 돼요" (면책 고지가 보이게)
3. 증상 체크 결과 (면책 고지가 보이게)
4. 병원 찾기 — 지도
5. 건강 기록

> 광고·가짜 리뷰·다른 앱 UI 를 넣지 않는다. 샘플 반려견 이름은 실존 인물과 무관한 이름 사용.

## 6. 심사 정보 (App Review Information)

- 로그인 필요: **아니요** (데모 계정 없음)
- 연락처: thebeaever@gmail.com
- 메모:

```
- No account or login is required. All pet profile and health record data is stored only on the device (SQLite).
- Symptom checker and food lookup show general reference information only and are NOT a diagnosis. Every result screen shows a disclaimer advising users to consult a veterinarian. Emergency results link directly to the nearby animal hospital finder.
- Food safety information is based on publicly available veterinary references (e.g. ASPCA Animal Poison Control "People Foods to Avoid Feeding Your Pets").
- Hospital search uses the Kakao Local API (South Korea). The device's coordinates are sent to Kakao only when the hospital tab is used. If location permission is denied, users can search by region name instead.
- The app contains no ads, no analytics, and no tracking.
- Best tested with a South Korean location (e.g. Simulator > Features > Location > Custom: 37.4979, 127.0276 — Gangnam Station, Seoul).
```

## 7. App Privacy (T3.3)

"데이터를 수집합니까?" → **예** (위치가 카카오로 전송되므로 보수적으로 신고)

| 데이터 유형 | 수집 | 용도 | 사용자와 연결 | 추적 |
|---|---|---|---|---|
| 위치 – 정확한 위치 | 예 | 앱 기능 | 아니요 | 아니요 |
| 그 외 모든 유형 (연락처·건강·사진·식별자·사용 데이터·진단 등) | 아니요 | — | — | — |

- 사진·반려견 건강 기록은 기기 밖으로 나가지 않으므로 "수집"이 아니다 (Apple 정의: 기기 밖으로 전송되어 개발자·제3자가 접근할 수 있는 경우만 수집).
- 지역명 검색의 Apple 지오코딩은 OS 기능이라 신고 대상이 아니다.
- ATT(추적 허용 팝업) 불필요.

## 8. 연령 등급

모든 설문 항목 **없음** → 예상 등급 4+.
- "의료 또는 치료 정보": **드물게/경미하게** 로 답한다 (반려동물 건강 참고 정보). 등급은 여전히 4+.
- 사용자 생성 콘텐츠 공유·채팅·웹 브라우징·도박·광고: 없음

## 9. 수출 규정

`app.json` 의 `usesNonExemptEncryption: false` 로 빌드마다 자동 응답된다. 묻는 경우 "암호화 사용 안 함(표준 HTTPS 만)".
