export function parseCookies(str: string): Record<string, string | null> {
  if (!str || typeof str !== 'string') return {};

  const cookies: Record<string, string | null> = {};
  const pairs = str.split(/[;,] */);
  pairs.forEach(function (pair) {
    let eq_idx = pair.indexOf('=');
    if (eq_idx === -1) {
      cookies[pair] = null;
      return;
    }
    const key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();
    if ('"' === val[0]) val = val.slice(1, -1);
    cookies[key] = decodeURIComponent(val);
  });

  return cookies;
}
