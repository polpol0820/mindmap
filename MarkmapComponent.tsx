'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';
import Modal from './../Molecules/Modal';

const transformer = new Transformer();

interface MarkmapComponentProps {
  markdownContent: string;
  onUpdateMarkdown: (newMarkdown: string) => void;
}

const MarkmapComponent: React.FC<MarkmapComponentProps> = ({ markdownContent, onUpdateMarkdown }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = '';

      const { root } = transformer.transform(markdownContent);
      const markmap = Markmap.create(svgRef.current);
      markmap.setData(root);

      const nodes = svgRef.current?.querySelectorAll('.markmap-node');
      if (nodes) {
        nodes.forEach((node) => {
          const htmlNode = node as HTMLElement;
          if (!htmlNode.dataset.bound) {
            htmlNode.style.cursor = 'pointer';
            htmlNode.addEventListener('click', (event) => {
              const text = htmlNode.textContent || '';
              const rect = htmlNode.getBoundingClientRect();
              setSelectedNode(text);
              setModalPosition({ x: rect.left, y: rect.top });
            });
            htmlNode.dataset.bound = 'true';
          }
        });
      }

      markmap.fit();
    }
  }, [markdownContent]);

  const deleteNode = (markdown: string, targetNode: string): string => {
    const lines = markdown.split('\n');
    const targetIndex = lines.findIndex((line) => line.includes(targetNode));
  
    if (targetIndex === -1) {
      // 対象ノードが見つからない場合はそのまま返す
      return markdown;
    }
  
    const getIndentLevel = (line: string): number => {
      // 行のインデントレベル（スペース数）
      return line.search(/\S|$/);
    };
  
    const getHeaderLevel = (line: string): number => {
      // ヘッダーのレベル（`##`なら2）
      const match = line.match(/^(#+)/);
      return match ? match[0].length : 0;
    };
  
    const targetIndent = getIndentLevel(lines[targetIndex]); // インデントレベル
    const targetHeaderLevel = getHeaderLevel(lines[targetIndex]); // ヘッダーの場合のレベル
  
    let endIndex = targetIndex + 1;
  
    // 削除範囲を特定（子ノードをすべて含む）
    while (endIndex < lines.length) {
      const currentLine = lines[endIndex];
      const currentIndent = getIndentLevel(currentLine);
      const currentHeaderLevel = getHeaderLevel(currentLine);
  
      // ヘッダーが同じか浅い階層に戻った場合、削除終了
      if (
        (targetHeaderLevel > 0 && currentHeaderLevel > 0 && currentHeaderLevel <= targetHeaderLevel) ||
        (targetHeaderLevel === 0 && currentIndent <= targetIndent)
      ) {
        break;
      }
  
      endIndex++;
    }
  
    // 選択ノードとその子ノードを削除
    lines.splice(targetIndex, endIndex - targetIndex);
    return lines.join('\n');
  };
  

  const handleAction = (action: 'edit' | 'add' | 'delete', text?: string) => {
    if (selectedNode) {
      let updatedMarkdown = markdownContent;

      if (action === 'edit' && text) {
        updatedMarkdown = markdownContent.replace(selectedNode, text);
      } else if (action === 'add' && text) {
        const lines = markdownContent.split('\n');
        const targetIndex = lines.findIndex((line) => line.includes(selectedNode));
        if (targetIndex !== -1) {
          lines.splice(targetIndex + 1, 0, `  - ${text}`);
          updatedMarkdown = lines.join('\n');
        }
      } else if (action === 'delete') {
        updatedMarkdown = deleteNode(markdownContent, selectedNode);
      }

      onUpdateMarkdown(updatedMarkdown);
    }
    setSelectedNode(null);
    setModalPosition(null);
  };

  const handleClose = () => {
    setSelectedNode(null);
    setModalPosition(null);
  };

  return (
    <>
      <svg ref={svgRef} style={{ width: '100%', height: '500px' }} />
      <Modal
        selectedNode={selectedNode}
        position={modalPosition}
        onAction={handleAction}
        onClose={handleClose}
      />
    </>
  );
};

export default MarkmapComponent;
