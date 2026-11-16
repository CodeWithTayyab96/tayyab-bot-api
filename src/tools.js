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
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=false`,
    { headers: { 'User-Agent': BROWSER_UA } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Country API failed: ' + res.status);
  const data = await res.json();
  if (!data.length) return null;
  const c = data[0];
  return {
    name: c.name?.common || name,
    capital: c.capital?.[0] || 'N/A',
    region: c.region || 'N/A',
    population: c.population || 0,
    flag: c.flag || '',
    currencies: c.currencies ? Object.values(c.currencies).map(v => v.name).join(', ') : 'N/A',
    languages: c.languages ? Object.values(c.languages).join(', ') : 'N/A',
  };
}

export async function convertCurrency(from, to, amount) {
  const res = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(to)}`,
    { headers: { 'User-Agent': BROWSER_UA } }
  );
  if (!res.ok) throw new Error('Currency conversion failed');
  const data = await res.json();
  const rate = data.rates?.[to.toUpperCase()];
  if (rate === undefined) throw new Error('Currency conversion failed');
  const numAmount = parseFloat(amount);
  return {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    amount: numAmount,
    rate,
    converted: parseFloat((numAmount * rate).toFixed(4)),
  };
}
