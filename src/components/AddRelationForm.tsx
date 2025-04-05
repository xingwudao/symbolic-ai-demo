import React, { useState } from 'react';

interface AddRelationFormProps {
  onAddNode: (name: string) => void;
  onAddLink: (source: string, target: string, label: string) => void;
  existingNodes: { id: string; name: string }[];
}

const AddRelationForm: React.FC<AddRelationFormProps> = ({ onAddNode, onAddLink, existingNodes }) => {
  const [newNodeName, setNewNodeName] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [relationLabel, setRelationLabel] = useState('');

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNodeName.trim()) {
      onAddNode(newNodeName.trim());
      setNewNodeName('');
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceNode && targetNode && relationLabel.trim()) {
      onAddLink(sourceNode, targetNode, relationLabel.trim());
      setSourceNode('');
      setTargetNode('');
      setRelationLabel('');
    }
  };

  return (
    <div className="add-relation-form">
      <form onSubmit={handleAddNode}>
        <h4>添加新人物</h4>
        <input
          type="text"
          value={newNodeName}
          onChange={(e) => setNewNodeName(e.target.value)}
          placeholder="输入人物姓名"
        />
        <button type="submit">添加</button>
      </form>

      <form onSubmit={handleAddLink}>
        <h4>添加关系</h4>
        <select
          value={sourceNode}
          onChange={(e) => setSourceNode(e.target.value)}
          required
        >
          <option value="">选择起始人物</option>
          {existingNodes.map(node => (
            <option key={node.id} value={node.id}>{node.name}</option>
          ))}
        </select>

        <select
          value={targetNode}
          onChange={(e) => setTargetNode(e.target.value)}
          required
        >
          <option value="">选择目标人物</option>
          {existingNodes.map(node => (
            <option key={node.id} value={node.id}>{node.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={relationLabel}
          onChange={(e) => setRelationLabel(e.target.value)}
          placeholder="输入关系（如：父亲、哥哥等）"
          required
        />

        <button type="submit">添加关系</button>
      </form>
    </div>
  );
};

export default AddRelationForm; 