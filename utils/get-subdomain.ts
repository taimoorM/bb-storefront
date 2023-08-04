export default function getSubdomain(url: string): string | null {
  const matches = url.match(/(?:https?:\/\/)?(?:www\.)?(.+?)\./i);

  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
}
