import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, space, fontFamily, typography } from '../../theme';
import { Verdict, SectionHeading, Bullets, Chip } from '../ui';
import type { Food } from '../../lib/sampleData';

// SCR-006 음식 결과 — 안전도 판정 화면 본문.
// 화면은 이 컴파운드를 조립만 하고, 레벨(safe/caution/danger) 분기는 내부에서 처리한다.
export interface FoodResultProps {
  food: Food;
}

function FoodResultRoot({ food }: FoodResultProps) {
  return (
    <View style={styles.stack}>
      <FoodResult.Header name={food.name} />
      <Verdict level={food.level} />
      <FoodResult.Description level={food.level} text={food.reason} serve={food.serve} />
      {food.symptoms != null && food.symptoms.length > 0 && (
        <FoodResult.Symptoms items={food.symptoms} />
      )}
      {food.nutrition != null && food.nutrition.length > 0 && (
        <FoodResult.Nutrition items={food.nutrition} />
      )}
      {food.related != null && food.related.length > 0 && (
        <FoodResult.RelatedFoods level={food.level} items={food.related} />
      )}
    </View>
  );
}

function FoodHeader({ name }: { name: string }) {
  return <Text style={styles.name}>{name}</Text>;
}

function FoodDescription({
  level,
  text,
  serve,
}: {
  level: Food['level'];
  text: string;
  serve?: string;
}) {
  const title =
    level === 'safe' ? '왜 괜찮을까요?' : level === 'caution' ? '왜 주의해야 하나요?' : '왜 위험한가요?';
  return (
    <View style={styles.block}>
      <SectionHeading>{title}</SectionHeading>
      <Text style={styles.body}>{text}</Text>
      {serve != null && (
        <View style={styles.serve}>
          <SectionHeading>이렇게 주세요</SectionHeading>
          <Text style={styles.body}>{serve}</Text>
        </View>
      )}
    </View>
  );
}

function FoodSymptoms({ items }: { items: string[] }) {
  return (
    <View style={styles.block}>
      <SectionHeading>먹었을 때 증상</SectionHeading>
      <Bullets items={items} variant="danger" />
    </View>
  );
}

function FoodNutrition({ items }: { items: string[] }) {
  return (
    <View style={styles.block}>
      <SectionHeading>영양 정보</SectionHeading>
      <View style={styles.chips}>
        {items.map((n) => (
          <Chip key={n} variant="brand">
            {n}
          </Chip>
        ))}
      </View>
    </View>
  );
}

function FoodRelated({ level, items }: { level: Food['level']; items: string[] }) {
  return (
    <View style={styles.block}>
      <SectionHeading>{level === 'danger' ? '이것도 피하세요' : '함께 보면 좋아요'}</SectionHeading>
      <View style={styles.chips}>
        {items.map((n) => (
          <Chip key={n}>{n}</Chip>
        ))}
      </View>
    </View>
  );
}

export const FoodResult = Object.assign(FoodResultRoot, {
  Header: FoodHeader,
  Description: FoodDescription,
  Symptoms: FoodSymptoms,
  Nutrition: FoodNutrition,
  RelatedFoods: FoodRelated,
});

const styles = StyleSheet.create({
  stack: { gap: space[5] },
  name: { fontFamily, fontSize: typography.h1.size, fontWeight: '800', color: colors.text },
  block: { gap: 0 },
  body: {
    fontFamily,
    fontSize: typography.body.size,
    lineHeight: typography.body.size * typography.body.lineHeight,
    color: colors.text,
  },
  serve: { marginTop: space[3] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
