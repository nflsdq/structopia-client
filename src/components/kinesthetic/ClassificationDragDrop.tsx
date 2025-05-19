import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface ClassificationDragDropProps {
  items: Array<{ id: string; name: string }>;
  categories: Array<{
    group_id: string;
    group_name: string;
    options: Array<{ id: string; name: string }>;
  }>;
  correctMappings: Record<string, Record<string, string>>;
}

const ClassificationDragDrop = ({ items, categories, correctMappings }: ClassificationDragDropProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (groupId: string, optionId: string) => {
    if (!draggedItem) return;

    setAnswers(prev => ({
      ...prev,
      [draggedItem]: {
        ...prev[draggedItem],
        [groupId]: optionId
      }
    }));
    setDraggedItem(null);
  };

  const checkAnswers = () => {
    setShowFeedback(true);
  };

  const isCorrect = (itemId: string, groupId: string) => {
    if (!showFeedback) return null;
    return answers[itemId]?.[groupId] === correctMappings[itemId]?.[groupId];
  };

  return (
    <div className="space-y-6">
      {/* Items to classify */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => (
          <motion.div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            className="card-neumorph p-4 rounded-xl cursor-move hover:shadow-neumorph-sm transition-all"
            whileHover={{ scale: 1.02 }}
          >
            {item.name}
          </motion.div>
        ))}
      </div>

      {/* Classification categories */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.group_id} className="card-neumorph p-4 rounded-xl">
            <h3 className="font-semibold mb-3">{category.group_name}</h3>
            <div className="grid grid-cols-2 gap-4">
              {category.options.map(option => (
                <div
                  key={option.id}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(category.group_id, option.id)}
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-4 min-h-[100px]"
                >
                  <div className="font-medium mb-2">{option.name}</div>
                  {/* Show dropped items */}
                  {Object.entries(answers).map(([itemId, mappings]) => {
                    if (mappings[category.group_id] === option.id) {
                      const item = items.find(i => i.id === itemId);
                      return (
                        <motion.div
                          key={itemId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-neutral-100 p-2 rounded flex items-center justify-between"
                        >
                          <span>{item?.name}</span>
                          {showFeedback && (
                            isCorrect(itemId, category.group_id) ? (
                              <CheckCircle size={16} className="text-success-500" />
                            ) : (
                              <XCircle size={16} className="text-error-500" />
                            )
                          )}
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={checkAnswers}
        className="btn-primary w-full"
      >
        Periksa Jawaban
      </button>
    </div>
  );
};

export default ClassificationDragDrop;