import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Layers, ListOrdered } from 'lucide-react';

interface StackQueueSimulatorProps {
  // type prop might be deprecated or used for initial mode if desired, for now, we manage mode internally
  // type: 'stack' | 'queue'; 
  maxElements: number;
  allInstructions: { stack: string; queue: string }; // New prop for instructions
}

const StackQueueSimulator = ({ maxElements, allInstructions }: StackQueueSimulatorProps) => {
  const [elements, setElements] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentMode, setCurrentMode] = useState<'stack' | 'queue'>('stack'); // Default to stack mode

  const handleModeChange = (newMode: 'stack' | 'queue') => {
    setCurrentMode(newMode);
    setElements([]); // Reset elements when mode changes
    setInputValue('');
  };

  const handleAdd = () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || elements.length >= maxElements) return;

    setElements(prev => currentMode === 'stack' ? [...prev, value] : [value, ...prev]);
    setInputValue('');
  };

  const handleRemove = () => {
    setElements(prev => currentMode === 'stack' ? prev.slice(0, -1) : prev.slice(1));
  };

  const activeInstruction = currentMode === 'stack' ? allInstructions.stack : allInstructions.queue;

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => handleModeChange('stack')}
          className={`btn-neumorph px-4 py-2 flex items-center space-x-2 ${currentMode === 'stack' ? 'bg-primary-100 text-primary-700' : ''}`}
        >
          <Layers size={18} />
          <span>Stack</span>
        </button>
        <button
          onClick={() => handleModeChange('queue')}
          className={`btn-neumorph px-4 py-2 flex items-center space-x-2 ${currentMode === 'queue' ? 'bg-secondary-100 text-secondary-700' : ''}`}
        >
          <ListOrdered size={18} />
          <span>Queue</span>
        </button>
      </div>

      {/* Instructions based on mode */}
      {activeInstruction && (
        <div className="card-neumorph p-4 rounded-xl bg-neutral-50 mb-4">
          <p className="text-sm text-neutral-700">{activeInstruction}</p>
        </div>
      )}

      {/* Visualization */}
      <div className={`flex ${currentMode === 'stack' ? 'flex-col-reverse items-center' : 'flex-row items-center'} justify-center min-h-[80px] gap-4`}>
        <AnimatePresence>
          {elements.map((value, index) => (
            <motion.div
              key={`${currentMode}-${value}-${index}`} // Ensure key is unique on mode change too
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className={`card-neumorph w-16 h-16 rounded-xl flex items-center justify-center text-lg font-semibold
                ${index === (currentMode === 'stack' ? elements.length - 1 : 0) ? 'bg-primary-50' : ''}`}
            >
              {value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={currentMode === 'stack' ? 'Push nilai' : 'Enqueue nilai'}
          className="input-neumorph flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue || elements.length >= maxElements}
          className="btn-primary px-6 py-2 flex items-center space-x-2"
        >
          {currentMode === 'stack' ? (
            <>
              <span>Push</span>
              <ArrowDown size={16} />
            </>
          ) : (
            <>
              <span>Enqueue</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
        <button
          onClick={handleRemove}
          disabled={elements.length === 0}
          className="btn-secondary px-6 py-2 flex items-center space-x-2"
        >
          {currentMode === 'stack' ? (
            <>
              <span>Pop</span>
              <ArrowUp size={16} />
            </>
          ) : (
            <>
              <span>Dequeue</span>
              <ArrowLeft size={16} />
            </>
          )}
        </button>
      </div>

      {/* Status */}
      <div className="text-center text-neutral-600">
        {elements.length === 0 ? (
          <p>{currentMode === 'stack' ? 'Stack kosong' : 'Queue kosong'}</p>
        ) : elements.length === maxElements ? (
          <p>{currentMode === 'stack' ? 'Stack penuh' : 'Queue penuh'}</p>
        ) : (
          <p>{elements.length} dari {maxElements} elemen</p>
        )}
      </div>
    </div>
  );
};

export default StackQueueSimulator;