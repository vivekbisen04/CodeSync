import { editor } from 'monaco-editor';

// Custom theme definitions
export const customThemes = {
  'codesync-light': {
    base: 'vs' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'd73a49', fontStyle: 'bold' },
      { token: 'string', foreground: '032f62' },
      { token: 'number', foreground: '005cc5' },
      { token: 'regexp', foreground: '22863a' },
      { token: 'operator', foreground: 'd73a49' },
      { token: 'namespace', foreground: 'b31d28' },
      { token: 'type', foreground: '6f42c1' },
      { token: 'struct', foreground: 'e36209' },
      { token: 'class', foreground: '6f42c1' },
      { token: 'interface', foreground: '005cc5' },
      { token: 'parameter', foreground: '24292e' },
      { token: 'property', foreground: '005cc5' },
      { token: 'function', foreground: '6f42c1' },
      { token: 'variable', foreground: 'e36209' },
      { token: 'constant', foreground: '005cc5' },
      { token: 'attribute', foreground: '6f42c1' },
      { token: 'tag', foreground: '22863a' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292e',
      'editorLineNumber.foreground': '#6a737d',
      'editorLineNumber.activeForeground': '#24292e',
      'editor.selectionBackground': '#c8e1ff',
      'editor.inactiveSelectionBackground': '#e1f5fe',
      'editorCursor.foreground': '#24292e',
      'editor.selectionHighlightBackground': '#ffd33d33',
      'editor.wordHighlightBackground': '#ffd33d26',
      'editor.wordHighlightStrongBackground': '#ffd33d4d',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editorWhitespace.foreground': '#d1d5da',
      'editorIndentGuide.background': '#e1e4e8',
      'editorIndentGuide.activeBackground': '#d1d5da',
      'editorBracketMatch.background': '#c6e2ff',
      'editorBracketMatch.border': '#0366d6',
    }
  },
  
  'codesync-dark': {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f97583', fontStyle: 'bold' },
      { token: 'string', foreground: '9ecbff' },
      { token: 'number', foreground: '79b8ff' },
      { token: 'regexp', foreground: '85e89d' },
      { token: 'operator', foreground: 'f97583' },
      { token: 'namespace', foreground: 'fdaeb7' },
      { token: 'type', foreground: 'b392f0' },
      { token: 'struct', foreground: 'ffab70' },
      { token: 'class', foreground: 'b392f0' },
      { token: 'interface', foreground: '79b8ff' },
      { token: 'parameter', foreground: 'e1e4e8' },
      { token: 'property', foreground: '79b8ff' },
      { token: 'function', foreground: 'b392f0' },
      { token: 'variable', foreground: 'ffab70' },
      { token: 'constant', foreground: '79b8ff' },
      { token: 'attribute', foreground: 'b392f0' },
      { token: 'tag', foreground: '85e89d' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e1e4e8',
      'editorLineNumber.foreground': '#6a737d',
      'editorLineNumber.activeForeground': '#e1e4e8',
      'editor.selectionBackground': '#173a5e',
      'editor.inactiveSelectionBackground': '#0e2f44',
      'editorCursor.foreground': '#e1e4e8',
      'editor.selectionHighlightBackground': '#ffd33d22',
      'editor.wordHighlightBackground': '#ffd33d1a',
      'editor.wordHighlightStrongBackground': '#ffd33d33',
      'editor.lineHighlightBackground': '#161b22',
      'editorWhitespace.foreground': '#484f58',
      'editorIndentGuide.background': '#30363d',
      'editorIndentGuide.activeBackground': '#6a737d',
      'editorBracketMatch.background': '#0366d625',
      'editorBracketMatch.border': '#1f6feb',
    }
  }
};

// Editor configuration presets
export const editorConfigs = {
  default: {
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, SF Mono, Consolas, Monaco, monospace',
    lineHeight: 1.6,
    letterSpacing: 0.5,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
    renderLineHighlight: 'line' as const,
    smoothScrolling: true,
    cursorBlinking: 'smooth' as const,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    tabCompletion: 'on' as const,
    parameterHints: { enabled: true },
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'mouseover' as const,
    matchBrackets: 'always' as const,
    autoIndent: 'full' as const,
    colorDecorators: true,
    contextmenu: true,
    mouseWheelZoom: true,
    multiCursorModifier: 'ctrlCmd' as const,
    accessibilitySupport: 'auto' as const,
    renderWhitespace: 'selection' as const,
    rulers: [80, 120],
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      bracketPairsHorizontal: false,
      highlightActiveBracketPair: true,
      indentation: true,
      highlightActiveIndentation: true
    },
    lightbulb: { enabled: true },
    hover: { enabled: true, sticky: true },
    links: true,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
    },
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: 'never' as const,
      seedSearchStringFromSelection: 'always' as const
    }
  },
  
  minimal: {
    fontSize: 13,
    fontFamily: 'SF Mono, Consolas, Monaco, monospace',
    lineHeight: 1.5,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'off' as const,
    lineNumbers: 'off' as const,
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    scrollbar: {
      verticalScrollbarSize: 4,
      horizontalScrollbarSize: 4,
    }
  },
  
  presentation: {
    fontSize: 16,
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    lineHeight: 1.8,
    letterSpacing: 0.8,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    renderLineHighlight: 'none' as const,
    rulers: [],
    overviewRulerLanes: 0,
    scrollbar: {
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
    }
  }
};

// Language-specific configurations
export const languageConfigs = {
  javascript: {
    tabSize: 2,
    insertSpaces: true,
  },
  typescript: {
    tabSize: 2,
    insertSpaces: true,
  },
  python: {
    tabSize: 4,
    insertSpaces: true,
  },
  go: {
    tabSize: 4,
    insertSpaces: false, // Go uses tabs
  },
  java: {
    tabSize: 4,
    insertSpaces: true,
  },
  cpp: {
    tabSize: 2,
    insertSpaces: true,
  },
  c: {
    tabSize: 2,
    insertSpaces: true,
  },
  csharp: {
    tabSize: 4,
    insertSpaces: true,
  },
  php: {
    tabSize: 4,
    insertSpaces: true,
  },
  ruby: {
    tabSize: 2,
    insertSpaces: true,
  },
  rust: {
    tabSize: 4,
    insertSpaces: true,
  }
};

// Key bindings
export const keyBindings = [
  {
    key: 'Ctrl+S',
    command: 'codesync.save',
    description: 'Save snippet'
  },
  {
    key: 'Ctrl+Shift+F',
    command: 'editor.action.formatDocument',
    description: 'Format document'
  },
  {
    key: 'Ctrl+/',
    command: 'editor.action.commentLine',
    description: 'Toggle line comment'
  },
  {
    key: 'Ctrl+Shift+/',
    command: 'editor.action.blockComment',
    description: 'Toggle block comment'
  },
  {
    key: 'Ctrl+D',
    command: 'editor.action.addSelectionToNextFindMatch',
    description: 'Add selection to next find match'
  },
  {
    key: 'Alt+Up',
    command: 'editor.action.moveLinesUpAction',
    description: 'Move line up'
  },
  {
    key: 'Alt+Down',
    command: 'editor.action.moveLinesDownAction',
    description: 'Move line down'
  },
  {
    key: 'Ctrl+Shift+K',
    command: 'editor.action.deleteLines',
    description: 'Delete line'
  },
  {
    key: 'Ctrl+Enter',
    command: 'editor.action.insertLineAfter',
    description: 'Insert line after'
  },
  {
    key: 'Ctrl+Shift+Enter',
    command: 'editor.action.insertLineBefore',
    description: 'Insert line before'
  }
];

// Utility function to get theme based on system theme
export const getEditorTheme = (systemTheme: string | undefined): string => {
  switch (systemTheme) {
    case 'dark':
      return 'codesync-dark';
    case 'light':
      return 'codesync-light';
    default:
      return 'codesync-dark';
  }
};

// Utility function to merge configurations
export const mergeConfigs = (
  baseConfig: any,
  languageConfig?: any,
  customConfig?: any
) => {
  return {
    ...baseConfig,
    ...languageConfig,
    ...customConfig
  };
};