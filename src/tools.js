const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export function calculate(expr) {
  if (/[a-zA-Z]/.test(expr)) throw new Error('Invalid expression: letters not allowed');

  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if (/[0-9.]/.test(expr[i])) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) { num += expr[i]; i++; }
      const val = parseFloat(num);
      if (isNaN(val)) throw new Error('Invalid number: ' + num);
      tokens.push({ type: 'num', value: val });
    } else if ('+-*/%()'.includes(expr[i])) {
      tokens.push({ type: 'op', value: expr[i] });
      i++;
    } else {
      throw new Error('Invalid character: ' + expr[i]);
    }
  }

  if (tokens.length === 0) throw new Error('Empty expression');

  let pos = 0;
  function peek() { return pos < tokens.length ? tokens[pos] : null; }
  function consume() { return tokens[pos++]; }

  function parseExpr() {
    let left = parseTerm();
    while (peek() && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (peek() && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
      const op = consume().value;
      const right = parseFactor();
      if (op === '*') left *= right;
      else if (op === '/') {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      } else {
        left %= right;
      }
    }
    return left;
  }

  function parseFactor() {
    if (peek() && peek().value === '-') { consume(); return -parseFactor(); }
    if (peek() && peek().value === '+') { consume(); return parseFactor(); }
    return parseAtom();
  }

  function parseAtom() {
    const t = peek();
    if (!t) throw new Error('Unexpected end of expression');
    if (t.type === 'num') { consume(); return t.value; }
    if (t.value === '(') {
      consume();
      const val = parseExpr();
      if (!peek() || peek().value !== ')') throw new Error('Missing closing parenthesis');
      consume();
      return val;
    }
    throw new Error('Unexpected token: ' + t.value);
  }

  const result = parseExpr();
  if (pos < tokens.length) throw new Error('Unexpected token: ' + tokens[pos].value);
  return result;
}

export async function lookupCountry(name) {
  const safeName = name.replace(/"/g, '\\"');
  const query = `{ countries(filter: { name: { regex: "${safeName}" } }) { code name capital currency emoji languages { name } } }`;
  const res = await fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': BROWSER_UA },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error('Country API failed: ' + res.status);
  const json = await res.json();
  const countries = json.data?.countries;
  if (!countries || !countries.length) {
    const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if (normalized === name) return null;
    const retryQuery = `{ countries(filter: { name: { regex: "${normalized.replace(/"/g, '\\"')}" } }) { code name capital currency emoji languages { name } } }`;
    const retryRes = await fetch('https://countries.trevorblades.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': BROWSER_UA },
      body: JSON.stringify({ query: retryQuery }),
    });
    if (!retryRes.ok) throw new Error('Country API failed: ' + retryRes.status);
    const retryJson = await retryRes.json();
    const retryCountries = retryJson.data?.countries;
    if (!retryCountries || !retryCountries.length) return null;
    const rc = retryCountries[0];
    return {
      name: rc.name || name,
      capital: rc.capital || 'N/A',
      currency: rc.currency || 'N/A',
      flag: rc.emoji || '',
      languages: rc.languages ? rc.languages.map(l => l.name) : [],
    };
  }
  const c = countries[0];
  return {
    name: c.name || name,
    capital: c.capital || 'N/A',
    currency: c.currency || 'N/A',
    flag: c.emoji || '',
    languages: c.languages ? c.languages.map(l => l.name) : [],
  };
}

export async function convertCurrency(from, to, amount) {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  const res = await fetch(
    `https://open.er-api.com/v6/latest/${encodeURIComponent(fromUpper)}`,
    { headers: { 'User-Agent': BROWSER_UA } }
  );
  if (!res.ok) throw new Error('Currency conversion failed');
  const data = await res.json();
  if (data.result !== 'success') throw new Error('Currency conversion failed');
  const rate = data.rates?.[toUpper];
  if (rate === undefined) throw new Error('Unsupported currency: ' + toUpper);
  const numAmount = parseFloat(amount);
  return {
    from: fromUpper,
    to: toUpper,
    amount: numAmount,
    rate,
    converted: parseFloat((numAmount * rate).toFixed(2)),
  };
}
