/**
 * Pick bilingual field: prefer `field_hi` when lang is Hindi and value is non-empty.
 * Works for strings and arrays.
 */
export function getLocalized<T = unknown>(
  obj: Record<string, any> | null | undefined,
  field: string,
  lang: string,
): T {
  if (!obj) {
    return '' as T;
  }
  if (lang === 'hi' || lang?.startsWith?.('hi')) {
    const hi = obj[`${field}_hi`];
    if (hi != null && hi !== '') {
      return hi as T;
    }
  }
  return (obj[field] ?? '') as T;
}

export function isHindi(lang: string): boolean {
  return lang === 'hi' || lang?.startsWith?.('hi');
}

/** Common exam taxonomy labels */
const CATEGORY_HI: Record<string, string> = {
  All: 'सभी',
  'Current Affairs': 'समसामयिक घटनाएँ',
  Economy: 'अर्थव्यवस्था',
  Economics: 'अर्थशास्त्र',
  'Socio-political': 'सामाजिक-राजनीतिक',
  'Security & Governance': 'सुरक्षा और शासन',
  'Abstract/General': 'अमूर्त / सामान्य',
  Easy: 'आसान',
  Medium: 'मध्यम',
  Hard: 'कठिन',
  Governance: 'शासन',
  Environment: 'पर्यावरण',
  Society: 'समाज',
  Polity: 'राजव्यवस्था',
  Health: 'स्वास्थ्य',
  Tech: 'तकनीक',
  Science: 'विज्ञान',
  Agriculture: 'कृषि',
  Security: 'सुरक्षा',
};

export function localizeLabel(label: string, lang: string): string {
  if (!isHindi(lang)) {
    return label;
  }
  return CATEGORY_HI[label] || label;
}
