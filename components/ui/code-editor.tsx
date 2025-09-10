'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Download, 
  Maximize2, 
  Minimize2, 
  Settings,
  RotateCcw,
  ZoomIn,
  ZoomOut 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  customThemes, 
  editorConfigs, 
  languageConfigs, 
  getEditorTheme,
  mergeConfigs 
} from '@/lib/monaco-config';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  placeholder?: string;
  className?: string;
}

// Monaco Editor language mapping
const getMonacoLanguage = (language: string): string => {
  const languageMap: Record<string, string> = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'csharp': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'dart': 'dart',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sql': 'sql',
    'json': 'json',
    'yaml': 'yaml',
    'markdown': 'markdown',
    'bash': 'bash',
    'shell': 'shell',
    'xml': 'xml',
    'other': 'plaintext'
  };
  
  return languageMap[language.toLowerCase()] || 'plaintext';
};

// Editor themes
const themes = {
  light: 'light',
  dark: 'vs-dark',
  'high-contrast': 'hc-black'
};

export function CodeEditor({
  value,
  onChange,
  language,
  height = '400px',
  readOnly = false,
  showToolbar = true,
  placeholder = 'Start typing your code...',
  className = ''
}: CodeEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);

  // Initialize Monaco Editor with custom themes
  const handleBeforeMount = useCallback((monaco: any) => {
    // Define custom themes
    Object.entries(customThemes).forEach(([themeName, themeData]) => {
      monaco.editor.defineTheme(themeName, themeData);
    });
  }, []);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Get language-specific configuration
    const langConfig = languageConfigs[language.toLowerCase() as keyof typeof languageConfigs] || {};
    
    // Merge configurations
    const finalConfig = mergeConfigs(
      editorConfigs.default,
      langConfig,
      { fontSize }
    );
    
    // Configure editor options
    editor.updateOptions(finalConfig);

    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      toast.success('Content saved!');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction').run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument').run();
      toast.success('Code formatted!');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction('editor.action.commentLine').run();
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction('editor.action.moveLinesUpAction').run();
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.moveLinesDownAction').run();
    });
  }, [language, fontSize]);

  // Copy content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Download content as file
  const downloadFile = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  // Get file extension based on language
  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'cs',
      'go': 'go',
      'rust': 'rs',
      'php': 'php',
      'ruby': 'rb',
      'swift': 'swift',
      'kotlin': 'kt',
      'dart': 'dart',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sql': 'sql',
      'json': 'json',
      'yaml': 'yml',
      'markdown': 'md',
      'bash': 'sh',
    };
    return extensions[lang.toLowerCase()] || 'txt';
  };

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      toast.success('Code formatted!');
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Adjust font size
  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  // Reset to default settings
  const resetEditor = () => {
    setFontSize(14);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: 14 });
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
    toast.success('Editor reset to defaults!');
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'} ${className}`}>
      <Card className={`${isFullscreen ? 'h-full' : ''} border-0 shadow-none`}>
        {showToolbar && (
          <div className="flex items-center justify-between p-3 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {language.charAt(0).toUpperCase() + language.slice(1)} Editor
              </span>
              <span className="text-xs text-muted-foreground">
                {value.split('\n').length} lines • {value.length} chars
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => adjustFontSize(-1)}
                title="Decrease font size"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => adjustFontSize(1)}
                title="Increase font size"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={formatCode}
                title="Format code (Shift+Alt+F)"
              >
                <Settings className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetEditor}
                title="Reset editor"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                title="Copy to clipboard (Ctrl+C)"
              >
                <Copy className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadFile}
                title="Download as file"
              >
                <Download className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3 w-3" />
                ) : (
                  <Maximize2 className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className={isFullscreen ? 'h-[calc(100%-60px)]' : ''}>
          <Editor
            height={isFullscreen ? '100%' : height}
            defaultLanguage={getMonacoLanguage(language)}
            language={getMonacoLanguage(language)}
            theme={getEditorTheme(theme)}
            value={value}
            onChange={(val) => onChange(val || '')}
            beforeMount={handleBeforeMount}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              placeholder,
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-muted-foreground">Loading editor...</span>
                </div>
              </div>
            }
          />
        </div>
      </Card>
      
      {isFullscreen && (
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-background"
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
}