export const BRAND_FONT = '"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const CODE_FONTS: Record<string, string> = {
  jetbrains: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
  fira: '"Fira Code", ui-monospace, "SF Mono", monospace',
  source: '"Source Code Pro", ui-monospace, "SF Mono", monospace',
};

export const TITLE_FONTS: Record<string, string> = {
  sans: BRAND_FONT,
  display: BRAND_FONT,
  fraunces: '"Fraunces", ui-serif, Georgia, serif',
  bricolage: `"Bricolage Grotesque", ${BRAND_FONT}`,
  caveat: '"Caveat", "Segoe Script", cursive',
  mono: CODE_FONTS.jetbrains,
};

export function getFontFamily(fontId: string): string {
  return TITLE_FONTS[fontId] || BRAND_FONT;
}
