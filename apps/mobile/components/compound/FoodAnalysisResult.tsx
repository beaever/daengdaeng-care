import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, fontFamily, typography, safetyColors } from '../../theme';
import { Card, GradeBadge, SectionHeading, IngredientItem, Divider } from '../ui';
import type { Product, Ingredient, ProductWarning } from '../../lib/sampleData';

// SCR-008 사료 분석 결과 — 제품 헤더 + 등급 + 원료 TOP5 + 주의 원료.
// 화면은 이 컴파운드를 조립만 한다.
export interface FoodAnalysisResultProps {
  product: Product;
}

function FoodAnalysisResultRoot({ product }: FoodAnalysisResultProps) {
  return (
    <View style={styles.stack}>
      <FoodAnalysisResult.ProductHeader name={product.name} brand={product.brand} />
      <FoodAnalysisResult.Grade grade={product.grade} label={product.gradeLabel} />
      <FoodAnalysisResult.IngredientList items={product.ingredients} />
      {product.warnings.length > 0 && (
        <FoodAnalysisResult.WarningSection warnings={product.warnings} />
      )}
    </View>
  );
}

function ProductHeader({ name, brand }: { name: string; brand: string }) {
  return (
    <View style={styles.productHeader}>
      <View style={styles.thumb}>
        <Text style={styles.thumbEmoji}>📦</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productBrand}>{brand}</Text>
      </View>
    </View>
  );
}

function Grade({ grade, label }: { grade: Product['grade']; label: string }) {
  return (
    <Card pad style={styles.gradeCard}>
      <GradeBadge grade={grade} />
      <View style={styles.gradeInfo}>
        <Text style={styles.gradeMicro}>종합 등급</Text>
        <Text style={styles.gradeLabel}>{label}</Text>
      </View>
    </Card>
  );
}

function IngredientList({ items }: { items: Ingredient[] }) {
  return (
    <View>
      <SectionHeading>주요 원료 TOP 5</SectionHeading>
      <Card flat style={styles.ingredientCard}>
        {items.map((it, i) => (
          <View key={it.rank}>
            <IngredientItem rank={it.rank} name={it.name} status={it.status} />
            {i < items.length - 1 && <Divider />}
          </View>
        ))}
      </Card>
    </View>
  );
}

function WarningSection({ warnings }: { warnings: ProductWarning[] }) {
  return (
    <View>
      <SectionHeading>주의가 필요한 원료</SectionHeading>
      <View style={styles.warningStack}>
        {warnings.map((w) => (
          <Card key={w.name} pad style={styles.warningCard}>
            <View style={styles.warningHead}>
              <View style={[styles.tag, { backgroundColor: safetyColors.caution.soft }]}>
                <Text style={[styles.tagText, { color: safetyColors.caution.strong }]}>주의</Text>
              </View>
              <Text style={styles.warningName}>{w.name}</Text>
            </View>
            <Text style={styles.warningNote}>{w.note}</Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

export const FoodAnalysisResult = Object.assign(FoodAnalysisResultRoot, {
  ProductHeader,
  Grade,
  IngredientList,
  WarningSection,
});

const styles = StyleSheet.create({
  stack: { gap: space[5] },
  productHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 28 },
  productInfo: { flex: 1, minWidth: 0, gap: 3 },
  productName: { fontFamily, fontSize: typography.title.size, fontWeight: '700', color: colors.text },
  productBrand: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  gradeCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  gradeInfo: { flex: 1, gap: 2 },
  gradeMicro: {
    fontFamily,
    fontSize: typography.micro.size,
    fontWeight: '700',
    color: colors.text3,
    letterSpacing: typography.micro.letterSpacing,
  },
  gradeLabel: { fontFamily, fontSize: typography.title.size, fontWeight: '700', color: colors.text },
  ingredientCard: { paddingHorizontal: 16 },
  warningStack: { gap: 10 },
  warningCard: { borderLeftWidth: 3, borderLeftColor: safetyColors.caution.base },
  warningHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontFamily, fontSize: typography.caption.size, fontWeight: '700' },
  warningName: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
  warningNote: {
    fontFamily,
    fontSize: typography.sub.size,
    lineHeight: typography.sub.size * typography.sub.lineHeight,
    color: colors.text2,
  },
});
