import { describe, it, expect } from 'vitest';
import {
  SYMPTOM_CATEGORIES,
  EMERGENCY_SYMPTOMS,
  VOMITING_QUESTIONS,
  SYMPTOM_RESULTS,
} from './symptoms';

const SEVERITY_LEVELS = ['emergency', 'today', 'watch'] as const;

describe('SYMPTOM_CATEGORIES', () => {
  it('카테고리는 비어 있지 않고 id가 유일하다', () => {
    expect(SYMPTOM_CATEGORIES.length).toBeGreaterThan(0);
    const ids = SYMPTOM_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(SYMPTOM_CATEGORIES)('"$label" 카테고리는 emoji·label·sub를 갖춘다', (c) => {
    expect(c.emoji).toBeTruthy();
    expect(c.label.trim().length).toBeGreaterThan(0);
    expect(c.sub.trim().length).toBeGreaterThan(0);
  });
});

describe('EMERGENCY_SYMPTOMS', () => {
  it('긴급 증상 분류(emergency)가 존재한다', () => {
    expect(EMERGENCY_SYMPTOMS.some((s) => s.id === 'emergency')).toBe(true);
  });
});

describe('VOMITING_QUESTIONS 결정 트리 정합성', () => {
  it('질문 목록이 비어 있지 않다', () => {
    expect(VOMITING_QUESTIONS.length).toBeGreaterThan(0);
  });

  it('모든 선택지는 next 또는 verdict 중 정확히 하나만 가진다', () => {
    VOMITING_QUESTIONS.forEach((question, qi) => {
      expect(question.options.length, `질문 ${qi} 선택지 없음`).toBeGreaterThan(0);
      question.options.forEach((opt) => {
        const hasNext = opt.next !== undefined;
        const hasVerdict = opt.verdict !== undefined;
        expect(hasNext !== hasVerdict, `질문 ${qi} "${opt.label}"의 분기 정의 오류`).toBe(true);
      });
    });
  });

  it('next는 항상 뒤쪽의 유효한 질문을 가리킨다 (순환·범위이탈 없음)', () => {
    VOMITING_QUESTIONS.forEach((question, qi) => {
      question.options.forEach((opt) => {
        if (opt.next === undefined) return;
        expect(opt.next).toBeGreaterThan(qi); // 앞으로만 진행 → 무한 루프 불가
        expect(opt.next).toBeLessThan(VOMITING_QUESTIONS.length);
      });
    });
  });

  it('모든 verdict는 유효한 심각도 레벨이며 결과 데이터가 존재한다', () => {
    VOMITING_QUESTIONS.forEach((question) => {
      question.options.forEach((opt) => {
        if (opt.verdict === undefined) return;
        expect(SEVERITY_LEVELS).toContain(opt.verdict);
        expect(SYMPTOM_RESULTS[opt.verdict]).toBeDefined();
      });
    });
  });
});

describe('SYMPTOM_RESULTS', () => {
  it('세 가지 심각도 레벨을 모두 정의한다', () => {
    for (const level of SEVERITY_LEVELS) {
      expect(SYMPTOM_RESULTS[level], `${level} 결과 누락`).toBeDefined();
    }
  });

  it.each(SEVERITY_LEVELS)('"%s" 결과는 level이 키와 일치하고 title·reason·actions를 갖춘다', (level) => {
    const r = SYMPTOM_RESULTS[level];
    expect(r.level).toBe(level);
    expect(r.title.trim().length).toBeGreaterThan(0);
    expect(r.reason.trim().length).toBeGreaterThan(0);
    expect(r.actions.length).toBeGreaterThan(0);
  });

  it('병원 안내 플래그가 심각도에 맞다 (RULES: emergency는 병원 직행)', () => {
    expect(SYMPTOM_RESULTS.emergency.hospital).toBe(true);
    expect(SYMPTOM_RESULTS.today.hospital).toBe(true);
    expect(SYMPTOM_RESULTS.watch.hospital).toBe(false);
  });
});
