import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface Node {
  id: string;
  value: number;
  next: string | null;
}

interface LinkedListBuilderProps {
  maxNodes: number;
}

const LinkedListBuilder = ({ maxNodes }: LinkedListBuilderProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState(false);

  const handleAddNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || nodes.length >= maxNodes) return;

    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      value,
      next: null
    };

    setNodes(prev => [...prev, newNode]);
    setInputValue('');
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => {
      const newNodes = prev.filter(node => node.id !== nodeId);
      // Update next pointers
      return newNodes.map(node => ({
        ...node,
        next: node.next === nodeId ? null : node.next
      }));
    });
    setSelectedNode(null);
    setLinkingMode(false);
  };

  const handleNodeClick = (nodeId: string) => {
    if (linkingMode) {
      if (selectedNode === nodeId) {
        setSelectedNode(null);
        setLinkingMode(false);
      } else if (selectedNode) {
        setNodes(prev => prev.map(node => ({
          ...node,
          next: node.id === selectedNode ? nodeId : node.next
        })));
        setSelectedNode(null);
        setLinkingMode(false);
      }
    } else {
      setSelectedNode(nodeId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Node creation controls */}
      <div className="flex space-x-4">
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Nilai node baru"
          className="input-neumorph flex-1"
        />
        <button
          onClick={handleAddNode}
          disabled={!inputValue || nodes.length >= maxNodes}
          className="btn-primary px-6"
        >
          Tambah Node
        </button>
      </div>

      {/* Linked List visualization */}
      <div className="relative min-h-[200px] flex items-center justify-center">
        <div className="flex items-center space-x-8">
          <AnimatePresence>
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="relative"
              >
                <button
                  onClick={() => handleNodeClick(node.id)}
                  className={`w-16 h-16 card-neumorph rounded-xl flex items-center justify-center text-lg font-semibold
                    ${selectedNode === node.id ? 'ring-2 ring-primary-500' : ''}
                    ${linkingMode && selectedNode === node.id ? 'bg-primary-50' : ''}`}
                >
                  {node.value}
                </button>

                {node.next && (
                  <div className="absolute top-1/2 right-0 w-8 h-0.5 bg-primary-500 transform translate-x-full -translate-y-1/2">
                    <ArrowRight size={16} className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 text-primary-500" />
                  </div>
                )}

                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center hover:bg-error-600"
                >
                  <Minus size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setLinkingMode(!linkingMode)}
          disabled={!selectedNode}
          className={`btn-neumorph px-6 ${linkingMode ? 'bg-primary-50' : ''}`}
        >
          {linkingMode ? 'Batal Link' : 'Link Node'}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-neutral-600">
        {linkingMode ? (
          <p>Klik node tujuan untuk menghubungkan</p>
        ) : (
          <p>Klik node untuk memilih, kemudian klik "Link Node" untuk menghubungkan</p>
        )}
      </div>
    </div>
  );
};

export default LinkedListBuilder;