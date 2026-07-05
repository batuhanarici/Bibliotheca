export function toFileUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `file://${encodeURI(withSlash)}`;
}
