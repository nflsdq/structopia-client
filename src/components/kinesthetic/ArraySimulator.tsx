import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface ArraySimulatorProps {
  initialElements: number[];
  capacity: number;
}

const ArraySimulator = ({ initialElements, capacity }: ArraySimulatorProps) => {
  const [array, setArray] = useState(initialElements);
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const handleInsert = () => {
    const value = parseInt(insertValue);
    const index = parseInt(insertIndex);
    
    if (isNaN(value) || isNaN(index) || index < 0 || index > array.length) return;
    if (array.filter(x => x !== null).length >= capacity) return;

    setAnimatingIndex(index);
    const newArray = [...array];
    newArray.splice(index, 0, value);
    if (newArray.length > capacity) newArray.pop();
    setArray(newArray);
    
    setTimeout(() => setAnimatingIndex(null), 500);
    setInsertValue('');
    setInsertIndex('');
  };

  const handleDelete = (index: number) => {
    setAnimatingIndex(index);
    const newArray = [...array];
    newArray.splice(index, 1);
    newArray.push(null);
    setArray(newArray);
    
    setTimeout(() => setAnimatingIndex(null), 500);
  };

  return (
    <div className="space-y-6">
      {/* Array visualization */}
      <div className="flex items-center justify-center space-x-2">
        {array.map((value, index) => (
          <motion.div
            key={index}
            initial={animatingIndex === index ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            className={`w-12 h-12 card-neumorph rounded-lg flex items-center justify-center
              ${value === null ? 'border-2 border-dashed border-neutral-300' : ''}`}
          >
            {value !== null && value}
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="number"
            value={insertValue}
            onChange={e => setInsertValue(e.target.value)}
            placeholder="Nilai"
            className="input-neumorph flex-1"
          />
          <input
            type="number"
            value={insertIndex}
            onChange={e => setInsertIndex(e.target.value)}
            placeholder="Index"
            className="input-neumorph flex-1"
          />
          <button
            onClick={handleInsert}
            className="btn-primary px-4"
            disabled={!insertValue || !insertIndex}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {array.map((value, index) => (
            value !== null && (
              <button
                key={index}
                onClick={() => handleDelete(index)}
                className="btn-neumorph py-2 flex items-center justify-center space-x-2"
              >
                <span>Hapus index {index}</span>
                <Minus size={16} />
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArraySimulator;