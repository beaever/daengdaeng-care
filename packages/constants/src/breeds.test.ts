import { describe, it, expect } from 'vitest';
import { BREEDS, POPULAR_BREEDS, searchBreeds } from './breeds';

describe('BREEDS 데이터 정합성', () => {
  it('견종 이름은 중복되지 않는다', () => {
    const names = BREEDS.map((b) => b.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('POPULAR_BREEDS는 모두 검색으로 찾을 수 있다', () => {
    for (const name of POPULAR_BREEDS) {
      expect(searchBreeds(name).map((b) => b.name), `${name} 검색 실패`).toContain(name);
    }
  });
});

describe('searchBreeds()', () => {
  it('영문 alias로 항목을 찾는다', () => {
    expect(searchBreeds('maltese').map((b) => b.name)).toContain('말티즈');
  });

  it('대소문자를 구분하지 않는다', () => {
    expect(searchBreeds('MALTESE').map((b) => b.name)).toContain('말티즈');
  });

  it('공백 없이 입력해도 매칭된다', () => {
    expect(searchBreeds('골든리트리버').map((b) => b.name)).toContain('골든 리트리버');
  });

  it('별칭 부분일치로 믹스견을 찾는다', () => {
    expect(searchBreeds('믹스').map((b) => b.name)).toContain('믹스견');
  });

  it('빈 질의·공백 질의는 빈 배열을 반환한다', () => {
    expect(searchBreeds('')).toEqual([]);
    expect(searchBreeds('   ')).toEqual([]);
  });
});
