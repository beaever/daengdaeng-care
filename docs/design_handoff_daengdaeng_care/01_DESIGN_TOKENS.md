# 01 · 디자인 토큰 (Design Tokens)

> 모든 스타일의 **단일 출처**. 값을 화면/컴포넌트에 하드코딩하지 말고 반드시 토큰을 참조하세요.
> 원본: `reference/daeng/tokens.css` (CSS 변수). 라이트/다크 모두 정의됨.

---

## 1. 컬러

### 1.1 브랜드 (Warm Amber)
| 토큰 | HEX | 용도 |
|---|---|---|
| `brand-50`  | `#FFF8EC` | soft 배경 (라이트) |
| `brand-100` | `#FEEFD0` | soft 보더 |
| `brand-200` | `#FCDDA1` | |
| `brand-300` | `#FAC768` | 그라데이션 |
| `brand-400` | `#F8B13C` | 그라데이션 시작 |
| **`brand-500`** | **`#F59E0B`** | **Primary (기본 브랜드색)** |
| `brand-600` | `#DB8504` | press 상태 |
| `brand-700` | `#B56807` | brand 텍스트 (라이트) |
| `brand-800` | `#92520D` | |
| `brand-900` | `#78440F` | |

### 1.2 안전도 의미색 (Semantic) — ⚠️ 절대 브랜드색과 섞지 말 것
앱의 핵심 정보 전달 색. 일관성이 신뢰와 직결됩니다.
| 의미 | 기본 | strong(텍스트) | soft(배경, 라이트) | soft(배경, 다크) |
|---|---|---|---|---|
| **안전** safe | `#16A34A` | `#15803D` | `#E7F6EC` | `#14271A` |
| **주의** caution | `#C98A05` | `#A26F04` | `#FBF1D4` | `#2C2410` |
| **위험** danger | `#E0413B` | `#C32D2D` | `#FCE9E7` | `#301715` |
| **정보** info | `#2D74E0` | — | `#E6EFFC` | `#15233B` |

### 1.3 중립색 (Stone — 따뜻한 톤)
`#FFFFFF` `#FFFDF9` `#FAF6EF` `#F4EFE6` `#ECE5D9` `#DBD2C2` `#B9AE9B` `#938A78` `#6B6354` `#4C4537` `#2E2A21` `#1C1913` (0→900)

### 1.4 시맨틱 별칭 (테마 토큰) — **이걸 UI에서 직접 사용**
| 토큰 | 라이트 | 다크 |
|---|---|---|
| `bg` (앱 배경) | `#FFFDF9` | `#14110B` |
| `surface` (카드) | `#FFFFFF` | `#201B13` |
| `surface-2` (입력·칩 배경) | `#FAF6EF` | `#2A2419` |
| `surface-sunken` (세그먼트 트랙) | `#F4EFE6` | `#1A150E` |
| `border` | `#ECE5D9` | `#36301F` |
| `border-strong` | `#DBD2C2` | `#4A4230` |
| `text` (본문) | `#1F1B13` | `#F8F3E9` |
| `text-2` (보조) | `#6B6354` | `#BDB3A0` |
| `text-3` (흐림) | `#938A78` | `#877E6C` |
| `text-on-brand` | `#FFFFFF` | `#2A1A03` |
| `brand` | `#F59E0B` | `#FBAE2B` |
| `brand-press` | `#DB8504` | `#F59E0B` |
| `brand-soft` | `#FFF8EC` | `#2E2410` |
| `brand-text` | `#B56807` | `#FBC56A` |

> **다크모드 주의**: `brand`·`brand-text`·`*-soft` 값이 라이트와 다릅니다. 버튼·뱃지 텍스트는 절대 고정 hex로 두지 말고 테마 토큰을 쓰세요. (프로토타입에서 실제로 이 문제로 다크모드 카드 타이틀이 검정으로 나오는 버그가 있었습니다.)

---

## 2. 타이포그래피

- **서체**: `SUIT` (둥글고 친근, 한글 가독성 높음). 폴백: `Apple SD Gothic Neo`, `Pretendard`, system-ui
- 네이티브: SUIT 폰트 파일(woff2/otf)을 번들에 포함. 다운로드: github.com/sun-typeface/SUIT
- 한글 줄바꿈: **`word-break: keep-all`** (단어 중간에서 끊기지 않게). RN: `텍스트 줄바꿈 처리 동등 적용`

| 스타일 | size | line-height | weight | letter-spacing | 용도 |
|---|---|---|---|---|---|
| display | 30 | 1.22 | 800 | -0.02em | 큰 결과 타이틀 |
| h1 | 24 | 1.28 | 800 | -0.02em | 화면 핵심 질문/제목 |
| h2 | 20 | 1.32 | 700 | -0.015em | 섹션 소제목 |
| title | 17 | 1.40 | 700 | -0.01em | 카드/병원 이름, 헤더 타이틀 |
| callout | 16 | 1.50 | 600 | — | 버튼·리스트 타이틀 |
| body | 15 | 1.55 | 500 | — | 본문 설명 |
| sub | 14 | 1.50 | 500 | — | 보조 텍스트 |
| caption | 13 | 1.45 | 500 | — | 캡션·메타 |
| micro | 11 | 1.30 | 700 | +0.02em | 라벨·AD 태그 |

> **최소 크기 규칙**: 본문성 텍스트는 13px 미만 금지. 터치 타깃은 최소 44px(iOS)·48dp(Android).

---

## 3. 스페이싱 (4pt 그리드)
`4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64`
- 화면 좌우 패딩(`page-pad`): **20px**
- 카드 내부 패딩: **18px**
- 리스트 행 패딩: **16px 18px**
- 섹션 간 간격: **22px**, 폼 필드 간격: **16–18px**

## 4. 라운드 (Radius)
| 토큰 | 값 | 용도 |
|---|---|---|
| xs | 8 | 작은 아이콘 박스 |
| sm | 12 | 버튼·입력·칩 컨테이너 |
| md | 16 | 카드 |
| lg | 20 | 큰 결과 카드 |
| xl | 26 | |
| pill | 999 | 뱃지·칩·토글 |
> Tweaks에서 "각지게" 변형 시 전부 절반 이하로 축소(4/6/8/10/12). 기본은 둥근 iOS 톤.

## 5. 그림자 (Elevation) — 따뜻한 톤
| 토큰 | 라이트 | 용도 |
|---|---|---|
| sm | `0 1px 2px rgba(40,33,20,.05), 0 1px 1px rgba(40,33,20,.04)` | 카드 |
| md | `0 2px 6px rgba(40,33,20,.07), 0 1px 2px rgba(40,33,20,.05)` | 떠 있는 요소 |
| lg | `0 8px 24px rgba(40,33,20,.12), 0 2px 6px rgba(40,33,20,.06)` | 시트·모달 |
| brand | `0 6px 18px rgba(245,158,11,.32)` | Primary 버튼·FAB |
> 다크모드는 모두 `rgba(0,0,0,.4~.55)` 계열로 교체 (tokens.css 참조).

## 6. 모션 (Easing)
- `ease-out`: `cubic-bezier(.22,.61,.36,1)` — 일반 전환(색·배경)
- `ease-spring`: `cubic-bezier(.34,1.56,.64,1)` — 세그먼트 thumb, 스플래시 pop, 체크 등 포인트 인터랙션
- 기본 탭/press 스케일: `scale(.97~.92)`, 120ms

## 7. 레이아웃 상수
| | 값 |
|---|---|
| 탭바 높이 | 58px (+ 하단 safe-area inset) |
| 헤더 높이 | 52px (+ 상단 safe-area inset) |
| **광고 배너 높이** | **52px (50pt 예약)** — 레이아웃에 항상 자리 확보 |
| 최소 터치 타깃 | 44px |

---

## 8. 바로 쓸 수 있는 theme 파일 (React Native / TS 예시)

```ts
// theme/tokens.ts — 라이트/다크 공통 + 분기
export const palette = {
  brand: { 50:'#FFF8EC',100:'#FEEFD0',300:'#FAC768',400:'#F8B13C',
           500:'#F59E0B',600:'#DB8504',700:'#B56807' },
  safe:    { base:'#16A34A', strong:'#15803D', soft:'#E7F6EC', softDark:'#14271A' },
  caution: { base:'#C98A05', strong:'#A26F04', soft:'#FBF1D4', softDark:'#2C2410' },
  danger:  { base:'#E0413B', strong:'#C32D2D', soft:'#FCE9E7', softDark:'#301715' },
  info:    { base:'#2D74E0', soft:'#E6EFFC', softDark:'#15233B' },
};

export const light = {
  bg:'#FFFDF9', surface:'#FFFFFF', surface2:'#FAF6EF', sunken:'#F4EFE6',
  border:'#ECE5D9', borderStrong:'#DBD2C2',
  text:'#1F1B13', text2:'#6B6354', text3:'#938A78', onBrand:'#FFFFFF',
  brand:'#F59E0B', brandPress:'#DB8504', brandSoft:'#FFF8EC', brandText:'#B56807',
};
export const dark = {
  bg:'#14110B', surface:'#201B13', surface2:'#2A2419', sunken:'#1A150E',
  border:'#36301F', borderStrong:'#4A4230',
  text:'#F8F3E9', text2:'#BDB3A0', text3:'#877E6C', onBrand:'#2A1A03',
  brand:'#FBAE2B', brandPress:'#F59E0B', brandSoft:'#2E2410', brandText:'#FBC56A',
};

export const radius = { xs:8, sm:12, md:16, lg:20, xl:26, pill:999 };
export const space  = { 1:4,2:8,3:12,4:16,5:20,6:24,7:28,8:32,10:40,12:48,16:64 };
export const type = {
  display:{size:30,lh:1.22,weight:'800',ls:-0.02},
  h1:{size:24,lh:1.28,weight:'800',ls:-0.02},
  h2:{size:20,lh:1.32,weight:'700',ls:-0.015},
  title:{size:17,lh:1.40,weight:'700',ls:-0.01},
  callout:{size:16,lh:1.50,weight:'600'},
  body:{size:15,lh:1.55,weight:'500'},
  sub:{size:14,lh:1.50,weight:'500'},
  caption:{size:13,lh:1.45,weight:'500'},
  micro:{size:11,lh:1.30,weight:'700',ls:0.02},
};
```
> Flutter/SwiftUI도 동일 값으로 ThemeData / Color+Font 정의를 만드세요.
