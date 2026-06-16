import { describe, it, expect } from 'vitest';
import { FOODS, POPULAR_FOODS, searchFood } from './foods';

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

  it('POPULAR_FOODS는 모두 검색으로 찾을 수 있다', () => {
    for (const name of POPULAR_FOODS) {
      expect(searchFood(name), `${name} 검색 실패`).not.toBeNull();
    }
  });
});

describe('searchFood()', () => {
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
