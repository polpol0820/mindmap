'use client';

import React, { useState, useEffect } from 'react';
import Button from './../Atoms/Button';

interface ModalProps {
  selectedNode: string | null;
  position: { x: number; y: number } | null;
  onAction: (action: 'edit' | 'add' | 'delete', text?: string) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ selectedNode, position, onAction, onClose }) => {
  const [modalAction, setModalAction] = useState<'edit' | 'add' | 'delete' | null>(null);
  const [nodeText, setNodeText] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    setModalAction(null);
    setNodeText('');
    setShowConfirmDelete(false);
  }, [selectedNode]);

  const handleSave = () => {
    if (modalAction === 'edit' || modalAction === 'add') {
      if (nodeText) {
        onAction(modalAction, nodeText);
        onClose();
      }
    }
  };

  const handleDelete = () => {
    // 削除確定で削除を実行
    onAction('delete');
    setShowConfirmDelete(false);
    onClose();
  };

  if (!selectedNode || !position) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y + 10,
        left: position.x + 10,
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        width: '300px',
      }}
    >
      {!showConfirmDelete && !modalAction ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>{selectedNode}</h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
            <Button
              label="ノードを修正"
              onClick={() => setModalAction('edit')}
              type="primary"
            />
            <Button
              label="子ノードを追加"
              onClick={() => setModalAction('add')}
              type="secondary"
            />
            <Button
              label="削除"
              onClick={() => setShowConfirmDelete(true)} // 削除確認を表示
              type="danger"
            />
          </div>
        </>
      ) : showConfirmDelete ? (
        // 削除確認モーダル
        <div>
          <p style={{ fontSize: '14px', marginBottom: '20px' }}>
            本当に「{selectedNode}」を削除しますか？
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button label="削除する" onClick={handleDelete} type="danger" />
            <Button
              label="キャンセル"
              onClick={() => setShowConfirmDelete(false)} // 確認を閉じる
              type="secondary"
            />
          </div>
        </div>
      ) : (
        // 修正・追加モーダル
        <div>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}>
            {modalAction === 'edit' ? `「${selectedNode}」を修正` : `「${selectedNode}」に子ノードを追加`}
          </p>
          <input
            type="text"
            value={nodeText}
            onChange={(e) => setNodeText(e.target.value)}
            placeholder={modalAction === 'edit' ? '修正後の内容を入力' : '新しい子ノードを入力'}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button label="保存" onClick={handleSave} type="primary" />
            <Button
              label="キャンセル"
              onClick={() => setModalAction(null)} // 修正・追加モードを閉じる
              type="secondary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
