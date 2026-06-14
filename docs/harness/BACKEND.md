# Backend — 댕댕케어 하네스 가이드

## 역할 범위
v1.0은 **서버리스** 아키텍처다. Backend는 외부 API 연동, 로컬 DB 스키마, 캐싱 전략을 소유한다.

---

## v1.0 데이터 아키텍처

```
음식 판별    → packages/constants/foods.ts (번들 내 JSON, API 불필요)
사료 분석    → Open Pet Food Facts API (클라이언트에서 직접 호출)
병원 찾기    → Kakao Local API (클라이언트에서 직접 호출)
건강 기록    → expo-sqlite + Drizzle ORM (기기 로컬)
```

**서버, 데이터베이스 서버, 인증 서버 없음** — 운영 비용 $0 목표

---

## 외부 API 명세

### Open Pet Food Facts (사료 성분)
```
GET https://world.openpetfoodfacts.org/api/v0/product/{barcode}.json
- 인증: 없음 (공개 API)
- Rate limit: 명시적 제한 없음, 남용 금지
- 응답 파싱: product.ingredients_text, product.nutriments
- 에러: status !== 1 → "등록되지 않은 제품" 처리
```

### Kakao Local API (병원 검색)
```
GET https://dapi.kakao.com/v2/local/search/keyword.json
  ?query=동물병원&x={lng}&y={lat}&radius={m}&sort=distance
Authorization: KakaoAK {REST_API_KEY}
- 월 3,000,000 건 무료
- API Key: 환경변수 EXPO_PUBLIC_KAKAO_KEY (클라이언트 노출 허용 키)
- 에러: 위치 권한 없을 시 주소 입력 폴백
```

---

## 로컬 DB 스키마 (expo-sqlite + Drizzle)

```sql
-- 반려견 프로필
CREATE TABLE pets (
  id       INTEGER PRIMARY KEY,
  name     TEXT NOT NULL,
  breed    TEXT,
  dob      TEXT,           -- ISO date string
  sex      TEXT,           -- '남아' | '여아'
  neutered INTEGER,        -- 0|1
  photo    TEXT            -- file URI
);

-- 건강 기록
CREATE TABLE records (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id     INTEGER REFERENCES pets(id),
  type       TEXT NOT NULL,  -- 'vaccine' | 'weight' | 'vet'
  date       TEXT NOT NULL,  -- ISO date string
  title      TEXT NOT NULL,
  sub        TEXT,
  notes      TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

## 캐싱 전략

| 데이터 | 캐시 방법 | TTL |
|--------|-----------|-----|
| 병원 검색 결과 | AsyncStorage | 1시간 |
| 사료 바코드 결과 | AsyncStorage (LRU 20개) | 24시간 |
| 오프라인 감지 | NetInfo | 실시간 |

---

## 환경 변수 관리

```bash
# apps/mobile/.env.local (git 제외 — .gitignore에 포함)
EXPO_PUBLIC_KAKAO_KEY=your_kakao_rest_api_key

# EAS 빌드 환경변수는 eas.json secret 사용
```

---

## PR 체크리스트 (Backend)

- [ ] API Key가 코드에 하드코딩되지 않음
- [ ] 오프라인 에러 처리 구현됨
- [ ] API 호출 실패 시 사용자에게 명확한 에러 메시지 표시
- [ ] 캐시 무효화 로직이 있음 (해당되는 경우)
