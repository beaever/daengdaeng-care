import { describe, it, expect } from 'vitest';
import {
  SYMPTOM_CATEGORIES,
  EMERGENCY_SYMPTOMS,
  VOMITING_QUESTIONS,
  SYMPTOM_RESULTS,
  SYMPTOM_QUESTIONS,
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

describe('SYMPTOM_QUESTIONS 카테고리별 결정 트리', () => {
  it('키 집합이 SYMPTOM_CATEGORIES id 집합과 같다', () => {
    const keys = Object.keys(SYMPTOM_QUESTIONS).sort();
    const ids = SYMPTOM_CATEGORIES.map((c) => c.id).sort();
    expect(keys).toEqual(ids);
  });

  it('digest는 VOMITING_QUESTIONS를 그대로 쓴다', () => {
    expect(SYMPTOM_QUESTIONS.digest).toBe(VOMITING_QUESTIONS);
  });

  describe.each(Object.entries(SYMPTOM_QUESTIONS))('"%s" 트리', (id, tree) => {
    it('모든 선택지는 next 또는 verdict 중 정확히 하나만 가진다', () => {
      expect(tree.length).toBeGreaterThan(0);
      tree.forEach((question, qi) => {
        expect(question.options.length, `${id} 질문 ${qi} 선택지 없음`).toBeGreaterThan(0);
        question.options.forEach((opt) => {
          expect(
            (opt.next !== undefined) !== (opt.verdict !== undefined),
            `${id} 질문 ${qi} "${opt.label}"의 분기 정의 오류`,
          ).toBe(true);
          if (opt.verdict !== undefined) expect(SEVERITY_LEVELS).toContain(opt.verdict);
        });
      });
    });

    it('next는 배열 범위 안의 정수다', () => {
      tree.forEach((question) => {
        question.options.forEach((opt) => {
          if (opt.next === undefined) return;
          expect(Number.isInteger(opt.next)).toBe(true);
          expect(opt.next).toBeGreaterThanOrEqual(0);
          expect(opt.next).toBeLessThan(tree.length);
        });
      });
    });

    it('0번에서 출발한 모든 경로가 순환 없이 verdict에 도달한다', () => {
      const walk = (qi: number, path: number[]) => {
        expect(path, `${id} 순환: ${[...path, qi].join('→')}`).not.toContain(qi);
        for (const opt of tree[qi].options) {
          if (opt.next !== undefined) walk(opt.next, [...path, qi]);
          else expect(opt.verdict).toBeDefined();
        }
      };
      walk(0, []);
    });

    it('emergency verdict가 최소 1개 있다', () => {
      const hasEmergency = tree.some((q) => q.options.some((o) => o.verdict === 'emergency'));
      expect(hasEmergency).toBe(true);
    });
  });
});
