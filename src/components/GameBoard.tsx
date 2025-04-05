import React, { useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './GameBoard.css';

interface GraphNode {
  id: string;
  name: string;
  type: 'person' | 'relation';
  color?: string;
  x?: number;
  y?: number;
  val?: number;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  color?: string;
}

interface Rule {
  id: string;
  name: string;
  description: string;
  apply: (graph: { nodes: GraphNode[]; links: GraphLink[] }) => { nodes: GraphNode[]; links: GraphLink[] };
}

const GameBoard: React.FC = () => {
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [
      { id: 'zhangwei', name: '张伟', type: 'person', color: '#FF6B6B', val: 20 },
      { id: 'liming', name: '李明', type: 'person', color: '#4ECDC4', val: 20 },
      { id: 'lili', name: '李丽', type: 'person', color: '#45B7D1', val: 20 },
    ],
    links: [
      { source: 'zhangwei', target: 'liming', label: '父亲', color: '#FF6B6B' },
      { source: 'liming', target: 'lili', label: '哥哥', color: '#4ECDC4' },
    ],
  });

  const initialGraph: { nodes: GraphNode[]; links: GraphLink[] } = {
    nodes: [
      { id: 'zhangwei', name: '张伟', type: 'person' as const, color: '#FF6B6B', val: 20 },
      { id: 'liming', name: '李明', type: 'person' as const, color: '#4ECDC4', val: 20 },
      { id: 'lili', name: '李丽', type: 'person' as const, color: '#45B7D1', val: 20 },
    ],
    links: [
      { source: 'zhangwei', target: 'liming', label: '父亲', color: '#FF6B6B' },
      { source: 'liming', target: 'lili', label: '哥哥', color: '#4ECDC4' },
    ],
  };

  const [history, setHistory] = useState<{ nodes: GraphNode[]; links: GraphLink[] }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const graphRef = useRef<any>();

  const rules: Rule[] = [
    {
      id: 'father-child',
      name: '父子关系',
      description: '若 X 是 Y 的父亲，则 Y 是 X 的孩子',
      apply: (graph) => {
        const newGraph = { ...graph };
        graph.links.forEach(link => {
          if (link.label === '父亲') {
            newGraph.links.push({
              source: link.target,
              target: link.source,
              label: '孩子',
              color: '#FF6B6B',
            });
          }
        });
        return newGraph;
      },
    },
    {
      id: 'sibling',
      name: '兄妹关系',
      description: '若 X 是 Y 的哥哥，则 X 和 Y 有同一个父亲或母亲',
      apply: (graph) => {
        const newGraph = { ...graph };
        graph.links.forEach(link => {
          if (link.label === '哥哥') {
            const brotherFatherLink = graph.links.find(l => 
              l.target === link.source && l.label === '父亲'
            );
            if (brotherFatherLink) {
              const newLink = {
                source: brotherFatherLink.source,
                target: link.target,
                label: '父亲',
                color: brotherFatherLink.color
              };
              const linkExists = newGraph.links.some(l => 
                l.source === newLink.source && 
                l.target === newLink.target && 
                l.label === newLink.label
              );
              if (!linkExists) {
                newGraph.links.push(newLink);
              }
            }
          }
        });
        return newGraph;
      },
    },
  ];

  const applyRule = (rule: Rule) => {
    setHistory([...history, graph]);
    const newGraph = rule.apply(graph);
    setIsAnimating(true);
    setGraph(newGraph);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const undo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setGraph(previousState);
    }
  };

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (graphRef.current) {
      graphRef.current.centerAt(node.x || 0, node.y || 0, 1000);
      graphRef.current.zoom(2, 1000);
    }
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      setTimeout(() => {
        const bounds = graphRef.current.getGraphBoundingBox();
        if (bounds) {
          const centerX = (bounds.x1 + bounds.x2) / 2;
          const centerY = (bounds.y1 + bounds.y2) / 2;
          
          const width = bounds.x2 - bounds.x1;
          const height = bounds.y2 - bounds.y1;
          const scale = Math.min(
            500 / width,
            400 / height
          );
          
          graphRef.current.zoom(scale * 0.7, 1000);
          graphRef.current.centerAt(centerX, centerY - 100, 1000);
          graphRef.current.d3ReheatSimulation();
        }
      }, 1000);
    }
  }, []);

  return (
    <div className="game-board">
      <div className="panels-container">
        <div className="graph-panel">
          <ForceGraph2D
            ref={graphRef}
            graphData={graph}
            nodeLabel="name"
            linkLabel="label"
            nodeColor={node => (node as GraphNode).color || '#666'}
            linkColor={link => (link as GraphLink).color || '#999'}
            linkWidth={2}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            nodeVal={node => (node as GraphNode).val || 10}
            nodeRelSize={6}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            onNodeClick={handleNodeClick}
            cooldownTicks={100}
            d3AlphaDecay={0.01}
            d3VelocityDecay={0.3}
            width={600}
            height={500}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = (node as GraphNode).name;
              const fontSize = 12/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = (node as GraphNode).color || '#666';
              ctx.beginPath();
              ctx.arc(node.x || 0, node.y || 0, 10, 0, 2 * Math.PI);
              ctx.fill();
              ctx.fillStyle = 'white';
              ctx.fillText(label, node.x || 0, node.y || 0);
            }}
            linkCanvasObject={(link, ctx, globalScale) => {
              const label = (link as GraphLink).label;
              const fontSize = 10/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = (link as GraphLink).color || '#999';
              
              const source = link.source as any;
              const target = link.target as any;
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;
              
              const textWidth = ctx.measureText(label).width;
              const padding = 2;
              ctx.fillStyle = 'white';
              ctx.fillRect(
                midX - textWidth/2 - padding,
                midY - fontSize/2 - padding,
                textWidth + padding*2,
                fontSize + padding*2
              );
              
              ctx.fillStyle = (link as GraphLink).color || '#999';
              ctx.fillText(label, midX, midY);
            }}
          />
        </div>
        
        <div className="rules-panel">
          <h3>规则库</h3>
          <div className="rules">
            {rules.map(rule => (
              <div key={rule.id} className="rule-item">
                <div className="rule-info">
                  <h4>{rule.name}</h4>
                  <p>{rule.description}</p>
                </div>
                <button
                  className="use-button"
                  onClick={() => applyRule(rule)}
                  disabled={isAnimating}
                >
                  使用
                </button>
              </div>
            ))}
          </div>
          
          <div className="controls">
            <button onClick={undo} disabled={history.length === 0}>
              撤销上一条规则
            </button>
            <button onClick={() => setGraph(initialGraph)} disabled={history.length === 0}>
              复原所有
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 