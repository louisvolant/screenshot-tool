export const LANGUAGES = [
  'html', 'css', 'javascript', 'typescript', 'php', 'sql', 'json', 'python', 'yaml', 'markdown',
  'java', 'csharp', 'c', 'cpp', 'go', 'rust', 'kotlin', 'swift', 'ruby', 'bash', 'diff',
  'dart', 'scala', 'lua', 'toml', 'docker',
] as const;

export type LanguageId = typeof LANGUAGES[number];

const count = (src: string, re: RegExp): number => (src.match(re) ?? []).length;

export function detectLanguage(src: string): LanguageId {
  const s = src.trim();
  if (!s) return 'typescript';
  if (/<\?php/.test(s)) return 'php';
  if (/^diff --git |^@@ -\d+/m.test(s) || (/^--- \S/m.test(s) && /^\+\+\+ \S/m.test(s))) return 'diff';
  if (/^#!.*\b(ba|z|k|da)?sh\b/.test(s)) return 'bash';
  if (/^(FROM|ARG)\s+\S+/m.test(s) && count(s, /^(FROM|RUN|CMD|COPY|ADD|ENTRYPOINT|WORKDIR|EXPOSE|ENV)\s+\S/gm) >= 2) return 'docker';

  if (/^[[{]/.test(s)) {
    try {
      JSON.parse(s);
      return 'json';
    } catch {}
  }

  const js = count(s, /\b(const|let|var|function|return|import|export|await|async|console\.\w+|require\()\b|=>/g);
  const ts = count(s, /:\s*(string|number|boolean|void|any|unknown|never|Promise<|Record<|Array<)|\binterface\s+\w+|\btype\s+\w+\s*=|\bimport\s+type\b/g);
  const html = count(s, /<\/[a-z][\w-]*\s*>/gi) * 3 + count(s, /<(html|head|body|div|span|p|a|button|input|form)\b[^<>]*>/gi) * 2;
  const python = count(s, /^\s*(def|class)\s+\w+.*:\s*$|^\s*(elif|except|finally|with)\b|^\s*from\s+[\w.]+\s+import\b|\bprint\(|\bself\./gm) * 2;
  const sql = count(s, /^\s*(select|insert\s+into|update|delete\s+from|create\s+table)\b|\b(from|where|join|group\s+by|order\s+by)\b/gim) * 2;
  const rust = count(s, /\bfn\s+\w+\s*[<(]|\blet\s+mut\s|\bimpl(<[^>]*>)?\s+\w+|\bpub\s+(fn|struct|enum)\b|\b\w+!\s*[(\[{]/gm) * 4;
  const go = count(s, /^package\s+\w+\s*$|\bfunc\s+(\([^)]*\)\s*)?\w+\s*\(|:=|\bfmt\.\w+|\bdefer\s/gm) * 4;
  const java = count(s, /\bpublic\s+(static\s+)?(final\s+)?(class|interface|enum)\b|\bpublic\s+static\s+void\s+main\b|\bSystem\.out\./gm) * 4;

  const scores: Record<string, number> = {
    typescript: ts ? js + ts * 3 : 0,
    javascript: js,
    html,
    python,
    sql,
    rust,
    go,
    java,
  };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0] && sorted[0][1] > 0) {
    return sorted[0][0] as LanguageId;
  }
  return 'typescript';
}

export interface CodeToken {
  type: 'comment' | 'string' | 'number' | 'keyword' | 'function' | 'operator' | 'punctuation' | 'plain';
  text: string;
}

/**
 * Universal syntax tokenizer for 26 languages
 */
export function tokenizeLine(line: string, _lang: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let remaining = line;

  const patterns: Array<{ type: CodeToken['type']; regex: RegExp }> = [
    { type: 'comment', regex: /^(\/\/.*|#.*|\/\*.*?\*\/|--.*)/ },
    { type: 'string', regex: /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/ },
    { type: 'number', regex: /^(\b\d+(\.\d+)?\b)/ },
    { type: 'keyword', regex: /^(\b(function|return|const|let|var|if|else|for|while|import|export|from|class|extends|interface|type|public|private|static|async|await|def|fn|pub|impl|struct|enum|package|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof|null|undefined|true|false)\b)/ },
    { type: 'function', regex: /^(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/ },
    { type: 'operator', regex: /^([+\-*/%=&|<>!?:^~]+)/ },
    { type: 'punctuation', regex: /^([{}()[\];,])/ },
  ];

  while (remaining.length > 0) {
    let matched = false;

    // Fast-path whitespace
    const wsMatch = remaining.match(/^(\s+)/);
    if (wsMatch) {
      tokens.push({ type: 'plain', text: wsMatch[1] });
      remaining = remaining.slice(wsMatch[1].length);
      continue;
    }

    for (const p of patterns) {
      const m = remaining.match(p.regex);
      if (m && m[1]) {
        tokens.push({ type: p.type, text: m[1] });
        remaining = remaining.slice(m[1].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const char = remaining[0];
      tokens.push({ type: 'plain', text: char });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}
