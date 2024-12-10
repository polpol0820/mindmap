'use client';

import React from 'react';

interface MarkdownEditorProps {
  markdownContent: string;
  onChange: (newContent: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ markdownContent, onChange }) => {
  return (
    <div style={{ flex: '1', maxWidth: '40%' }}>
      <textarea
        value={markdownContent}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '500px',
          fontSize: '16px',
          padding: '10px',
          boxSizing: 'border-box',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
