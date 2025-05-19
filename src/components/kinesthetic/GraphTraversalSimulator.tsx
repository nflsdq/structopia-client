import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Node {
  id: string;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

interface GraphTraversalSimulatorProps {
  nodes: Node[];
  edges: Edge[];
  isDirected: boolean;
  traversalMethods: Array<{ id: string; name: string }>;
}

// Constants for layout
const NODE_DIAMETER = 48; // Corresponds to w-12, h-12 in Tailwind (3rem = 48px)
const Y_SPACING = 100;    // Vertical spacing between levels

const GraphTraversalSimulator = ({ nodes, edges, isDirected, traversalMethods }: GraphTraversalSimulatorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [startNode, setStartNode] = useState<string>('');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const resetTraversal = () => {
    setVisitedNodes([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const performDFS = (node: string, visited: Set<string> = new Set()): string[] => {
    const result: string[] = [];
    const stack = [node];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);
        
        const neighbors = edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to)
          .reverse();
        
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
    
    return result;
  };

  const performBFS = (node: string): string[] => {
    const result: string[] = [];
    const visited = new Set<string>();
    const queue = [node];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);
        
        const neighbors = edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to);
        
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }
    
    return result;
  };

  useEffect(() => {
    let interval: number;
    
    if (isPlaying && startNode && selectedMethod) {
      const traversalPath = selectedMethod === 'dfs' 
        ? performDFS(startNode)
        : performBFS(startNode);
      
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= traversalPath.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          setVisitedNodes(traversalPath.slice(0, prev + 2));
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, startNode, selectedMethod, nodes, edges]);

  useEffect(() => {
    const calculateLayout = () => {
      if (!nodes.length || !graphContainerRef.current) return {};

      const positions: Record<string, { x: number; y: number }> = {};
      const adj: Record<string, string[]> = {};
      const nodeMap = new Map(nodes.map(node => [node.id, node]));

      nodes.forEach(node => {
        adj[node.id] = [];
      });

      const actualInDegree: Record<string, number> = {};
      nodes.forEach(node => actualInDegree[node.id] = 0);

      edges.forEach(edge => {
        if (nodeMap.has(edge.from) && nodeMap.has(edge.to)) {
          adj[edge.from].push(edge.to);
          actualInDegree[edge.to]++;
          if (!isDirected) {
            adj[edge.to].push(edge.from); // For undirected, BFS needs to explore both ways
          }
        }
      });

      let roots = nodes.filter(node => actualInDegree[node.id] === 0).map(node => node.id);
      if (roots.length === 0 && nodes.length > 0) {
        roots = [nodes[0].id]; // Fallback root
      }

      const levels: string[][] = [];
      const visitedForLeveling = new Set<string>();
      let currentQueue = [...roots];
      roots.forEach(r => visitedForLeveling.add(r));

      while (currentQueue.length > 0) {
        levels.push([...currentQueue]);
        const nextQueue: string[] = [];
        for (const u of currentQueue) {
          const children = adj[u] || [];
          for (const v of children) {
            if (!visitedForLeveling.has(v)) {
              visitedForLeveling.add(v);
              nextQueue.push(v);
            }
          }
        }
        currentQueue = nextQueue;
      }

      const unlaidNodes = nodes.filter(n => !visitedForLeveling.has(n.id));
      if (unlaidNodes.length > 0) {
        levels.push(unlaidNodes.map(n => n.id));
      }

      const containerWidth = graphContainerRef.current.clientWidth;
      const containerHeight = graphContainerRef.current.clientHeight;

      levels.forEach((levelNodes, levelIndex) => {
        const y = (levelIndex + 0.5) * Y_SPACING;
        const numNodesInLevel = levelNodes.length;
        levelNodes.forEach((nodeId, nodeIndexInLevel) => {
          const x = (containerWidth / (numNodesInLevel + 1)) * (nodeIndexInLevel + 1);
          positions[nodeId] = { x, y };
        });
      });

      nodes.forEach(node => {
        if (!positions[node.id]) {
          positions[node.id] = { x: Math.random() * containerWidth, y: Math.random() * containerHeight };
        }
      });

      return positions;
    };

    setNodePositions(calculateLayout());
  }, [nodes, edges, isDirected]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex space-x-4">
        <select
          value={selectedMethod}
          onChange={e => setSelectedMethod(e.target.value)}
          className="input-neumorph flex-1"
        >
          <option value="">Pilih metode traversal</option>
          {traversalMethods.map(method => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>

        <select
          value={startNode}
          onChange={e => setStartNode(e.target.value)}
          className="input-neumorph flex-1"
          disabled={!selectedMethod}
        >
          <option value="">Pilih node awal</option>
          {nodes.map(node => (
            <option key={node.id} value={node.id}>
              Node {node.label}
            </option>
          ))}
        </select>
      </div>

      {/* Graph visualization */}
      <div ref={graphContainerRef} className="relative min-h-[300px] card-neumorph rounded-xl p-6 overflow-hidden">
        {/* Node rendering with absolute positioning */}
        {nodes.map(node => {
          const pos = nodePositions[node.id];
          if (!pos) return null; // Don't render if position not calculated

          return (
            <motion.div
              key={node.id}
              ref={el => nodeRefs.current.set(node.id, el)} 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold absolute
                ${visitedNodes.includes(node.id)
                  ? 'bg-primary-500 text-white' 
                  : 'card-neumorph' 
                }`
              }
              style={{
                left: pos.x - (NODE_DIAMETER / 2),
                top: pos.y - (NODE_DIAMETER / 2),
                zIndex: 1, // Ensure nodes are above edges
              }}
              animate={{
                scale: visitedNodes.includes(node.id) ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {node.label}
            </motion.div>
          );
        })}

        {/* Edges SVG - ensure it's behind nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#d1d9e6" />
            </marker>
            <marker
              id="arrowhead-visited"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#007bff" />
            </marker>
          </defs>
          {edges.map((edge, index) => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            
            if (!fromPos || !toPos) return null;

            const isVisited = visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to);

            return (
              <line
                key={index}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={isVisited ? '#007bff' : '#d1d9e6'}
                strokeWidth="2"
                markerEnd={isDirected ? (isVisited ? 'url(#arrowhead-visited)' : 'url(#arrowhead)') : undefined}
              />
            );
          })}
        </svg>
      </div>

      {/* Playback controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={!selectedMethod || !startNode}
          className="btn-primary px-6 py-2 flex items-center space-x-2"
        >
          {isPlaying ? (
            <>
              <Pause size={16} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Mulai</span>
            </>
          )}
        </button>

        <button
          onClick={resetTraversal}
          className="btn-neumorph px-6 py-2 flex items-center space-x-2"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Visited nodes sequence */}
      {visitedNodes.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-neutral-600 mb-2">Urutan kunjungan:</p>
          <div className="flex items-center justify-center space-x-2">
            {visitedNodes.map((nodeId, index) => {
              const node = nodes.find(n => n.id === nodeId);
              return (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm"
                >
                  {node?.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphTraversalSimulator;