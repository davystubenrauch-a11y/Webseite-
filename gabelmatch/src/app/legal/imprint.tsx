import { LegalDocumentView } from '@/components/LegalDocumentView';
import { LEGAL } from '@/content/legal';
import { useI18n } from '@/lib/i18n';

export default function Imprint() {
  const { locale } = useI18n();
  return <LegalDocumentView document={LEGAL.imprint[locale]} />;
}
