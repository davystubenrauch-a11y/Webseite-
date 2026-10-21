import { StyleSheet, View } from 'react-native';

import type { LegalDocument } from '@/content/legal';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

import { AppText } from './AppText';
import { Screen } from './Screen';

/** Rendert Rechtstexte; Platzhalter in [ECKIGEN KLAMMERN] werden farbig hervorgehoben. */
export function LegalDocumentView({ document }: { document: LegalDocument }) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const hasPlaceholders = document.sections.some((s) => s.paragraphs.some((p) => p.includes('[')));

  return (
    <Screen scroll edges={['bottom']} contentStyle={{ paddingTop: spacing.lg }}>
      {hasPlaceholders ? (
        <View style={[styles.notice, { backgroundColor: colors.primarySoft }]}>
          <AppText variant="label" style={{ color: colors.onPrimarySoft }}>
            {t('legal.placeholderNotice')}
          </AppText>
        </View>
      ) : null}
      <AppText variant="caption" color="textMuted">
        {document.updated}
      </AppText>
      {document.sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <AppText variant="heading">{section.heading}</AppText>
          {section.paragraphs.map((paragraph, index) => (
            <AppText key={index} selectable>
              {paragraph.split(/(\[[^\]]+\])/g).map((part, i) =>
                part.startsWith('[') ? (
                  <AppText key={i} variant="bodyStrong" style={{ color: colors.primary }}>
                    {part}
                  </AppText>
                ) : (
                  part
                ),
              )}
            </AppText>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { padding: spacing.md, borderRadius: radius.md },
  section: { gap: spacing.sm },
});
