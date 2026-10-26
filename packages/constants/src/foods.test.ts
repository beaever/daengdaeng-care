import { describe, it, expect } from 'vitest';
import { FOODS, POPULAR_FOODS, searchFood, searchFoods } from './foods';

const SAFETY_LEVELS = ['safe', 'caution', 'danger'] as const;
const entries = Object.entries(FOODS);

describe('FOODS 데이터 정합성', () => {
  it('음식 항목이 비어 있지 않다', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)('"%s" 항목은 필수 필드(name·level·reason)를 갖춘다', (_key, food) => {
    expect(food.name).toBeTruthy();
    expect(SAFETY_LEVELS).toContain(food.level);
    expect(food.reason.trim().length).toBeGreaterThan(0);
  });

  it('danger 등급 음식은 증상(symptoms)을 안내한다', () => {
    const dangers = entries.filter(([, f]) => f.level === 'danger');
    expect(dangers.length).toBeGreaterThan(0);
    for (const [key, food] of dangers) {
      expect(food.symptoms?.length ?? 0, `${key}에 symptoms 누락`).toBeGreaterThan(0);
    }
  });

  it.each(entries)('"%s" 키와 name 이 같다 (결과 화면이 FOODS[name] 으로 찾는다)', (key, food) => {
    expect(food.name).toBe(key);
  });

  it('별칭이 다른 음식의 이름과 겹치지 않는다 (마늘 검색 → 양파 결과 같은 혼동 방지)', () => {
    const names = new Set(Object.keys(FOODS));
    for (const [key, food] of entries) {
      for (const alias of food.aliases ?? []) {
        expect(names.has(alias) && alias !== key, `${key} 의 별칭 "${alias}" 가 다른 음식 이름과 같음`).toBe(false);
      }
    }
  });

  it.each(entries)('"%s" 항목은 근거 자료 URL 1~2개를 갖고, 판매업체 출처는 쓰지 않는다', (_key, food) => {
    expect(food.sources.length).toBeGreaterThanOrEqual(1);
    expect(food.sources.length).toBeLessThanOrEqual(2);
    for (const url of food.sources) {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toMatch(/petco|chewy|amazon/);
    }
  });

  it('caution 등급 음식은 급여 방법(serve)을 안내한다', () => {
    for (const [key, food] of entries.filter(([, f]) => f.level === 'caution')) {
      expect(food.serve, `${key}에 serve 누락`).toBeTruthy();
    }
  });

  it('POPULAR_FOODS는 모두 검색으로 찾을 수 있다', () => {
    for (const name of POPULAR_FOODS) {
      expect(searchFood(name), `${name} 검색 실패`).not.toBeNull();
    }
  });
});

describe('searchFood()', () => {
  it('마늘은 양파가 아닌 마늘 항목을 찾는다', () => {
    expect(searchFood('마늘')?.name).toBe('마늘');
  });

  it('별칭으로 묶인 음식을 찾는다 (맥주 → 술, 달걀 → 계란)', () => {
    expect(searchFood('맥주')?.name).toBe('술');
    expect(searchFood('달걀')?.name).toBe('계란');
  });

  it('한글 정확 일치로 항목을 찾는다', () => {
    expect(searchFood('포도')?.level).toBe('danger');
  });

  it('영문 alias로 항목을 찾는다', () => {
    expect(searchFood('grape')?.name).toBe('포도');
  });

  it('대소문자를 구분하지 않는다', () => {
    expect(searchFood('GRAPE')?.name).toBe('포도');
  });

  it('앞뒤 공백을 무시한다', () => {
    expect(searchFood('  초콜릿  ')?.name).toBe('초콜릿');
  });

  it('부분 문자열로도 매칭된다', () => {
    expect(searchFood('초콜')?.name).toBe('초콜릿');
  });

  it('존재하지 않는 음식은 null을 반환한다', () => {
    expect(searchFood('존재하지않는음식12345')).toBeNull();
  });

  it('빈 질의·공백 질의는 null을 반환한다 (전체 매칭 방지)', () => {
    expect(searchFood('')).toBeNull();
    expect(searchFood('   ')).toBeNull();
  });
});

describe('searchFoods()', () => {
  it('영문 alias로 다건 검색해 항목을 찾는다', () => {
    const results = searchFoods('grape');
    expect(results.map((f) => f.name)).toContain('포도');
  });

  it('대소문자를 구분하지 않는다', () => {
    const results = searchFoods('GRAPE');
    expect(results.map((f) => f.name)).toContain('포도');
  });

  it('빈 질의는 빈 배열을 반환한다', () => {
    expect(searchFoods('')).toEqual([]);
  });

  it('별칭 부분일치로도 찾을 수 있다', () => {
    const results = searchFoods('caffe');
    expect(results.map((f) => f.name)).toContain('커피');
  });
});
