// https://github.com/mermaid-js/mermaid-live-editor/blob/master/src/mermaid-language/mermaid.js
import monokai from 'monaco-themes/themes/Monokai.json';

import keywords from './editor/keywords';

const typeKeywords = [
  'graph',
  'stateDiagram',
  'sequenceDiagram',
  'classDiagram',
  'pie',
  'flowchart',
  'gantt',
];

const operators = [
  '+', '-', '/', '*',
  '=', '<', '>', '<=', '>=', '<>', '><', '=<', '=>',
  'EQ', 'NE', 'GE', 'LE',
  'CS', 'CN', 'CA', 'CO', 'CP', 'NS', 'NA', 'NP',
];

const symbols = /[=><!~?:&|+\-*/^%]+/;

export default (monaco) => {
  monaco.editor.defineTheme('monokai', monokai);

  monaco.languages.register({ id: 'mermaid' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('mermaid', {
    keywords,
    typeKeywords,
    operators,
    symbols,
    tokenizer: {
      root: [
        [
          /[a-z_$][\w$]*/,
          { cases: { '@typeKeywords': 'keyword', '@keywords': 'keyword' } },
        ],
        // [/[{}]/, 'delimiter.bracket'],
        // [/[-=>ox]+/, { cases: { '@operators': 'transition' } }],
        // [/[\[\{\(}]+.+?[\)\]\}]+/, 'string'],
        // [/\".*\"/, 'string'],
        [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'], // nested comment
        ['\\*/', 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
    },
  });

  // monaco.editor.defineTheme('myCoolTheme', {
  //   base: 'vs',
  //   inherit: false,
  //   rules: [
  //     { token: 'keyword', foreground: '880000', fontStyle: 'bold' },
  //     { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
  //     { token: 'string', foreground: 'AA8500' },
  //     { token: 'transition', foreground: '008800', fontStyle: 'bold'},
  //     { token: 'delimiter.bracket', foreground: '000000', fontStyle: 'bold'},
  //   ]
  // });

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('mermaid', {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: 'simpleText',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'simpleText',
        },
        {
          label: 'testing',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'testing(${1:condition})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: 'ifelse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'if (${1:condition}) {',
            '\t$0',
            '} else {',
            '\t',
            '}',
          ].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-Else Statement',
        },
      ];
      return { suggestions };
    },
  });
};
