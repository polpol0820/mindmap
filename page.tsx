'use client';

import React, { useState } from 'react';
import MarkmapComponent from './components/Organisms/MarkmapComponent';
import MarkdownEditor from './components/Atoms/MarkdownEditor';

const HomePage = () => {
  const [markdownContent, setMarkdownContent] = useState<string>('# 初期マインドマップ');
  const [inputPrompt, setInputPrompt] = useState<string>(''); // 要件入力用の状態
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態

  const handleGenerateMindmap = async () => {
    if (!inputPrompt.trim()) {
      alert('要件を入力してください');
      return;
    }

    setLoading(true);

    try {
      // LLM APIに要件を送信してMarkdownを生成 (ダミーコード)
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      if (!response.ok) {
        throw new Error('マインドマップ生成に失敗しました');
      }

      const data = await response.json();
      setMarkdownContent(data.markdown); // 生成されたMarkdownを設定
    } catch (error) {
      console.error('エラー:', error);
      alert('マインドマップ生成中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>マインドマップ生成ツール</h1>

      {/* 要件入力エリア */}
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="生成するマインドマップの要件を入力してください"
          style={{
            width: '100%',
            height: '100px',
            fontSize: '16px',
            padding: '10px',
            boxSizing: 'border-box',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={handleGenerateMindmap}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: loading ? '#ccc' : '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '生成中...' : '生成'}
        </button>
      </div>

      {/* マインドマップエリア */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <MarkdownEditor
          markdownContent={markdownContent}
          onChange={(newContent) => setMarkdownContent(newContent)}
        />
        <div style={{ flex: '2', border: '1px solid #ddd', padding: '10px', backgroundColor: '#f9f9f9' }}>
          <MarkmapComponent
            markdownContent={markdownContent}
            onUpdateMarkdown={(newMarkdown) => setMarkdownContent(newMarkdown)}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
