declare module 'react-force-graph-2d' {
  import { Component } from 'react';

  interface ForceGraphProps {
    graphData: {
      nodes: any[];
      links: any[];
    };
    nodeLabel?: string | ((node: any) => string);
    linkLabel?: string | ((link: any) => string);
    nodeColor?: string | ((node: any) => string);
    linkColor?: string | ((link: any) => string);
    linkWidth?: number;
    linkDirectionalArrowLength?: number;
    linkDirectionalArrowRelPos?: number;
    nodeVal?: number | ((node: any) => number);
    nodeRelSize?: number;
    linkDirectionalParticles?: number;
    linkDirectionalParticleWidth?: number;
    onNodeClick?: (node: any) => void;
    cooldownTicks?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    width?: number;
    height?: number;
    nodeCanvasObject?: (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => void;
    linkCanvasObject?: (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => void;
    ref?: any;
  }

  export default class ForceGraph2D extends Component<ForceGraphProps> {
    centerAt: (x: number, y: number, ms: number) => void;
    zoom: (scale: number, ms: number) => void;
    getGraphBoundingBox: () => { x1: number; y1: number; x2: number; y2: number } | undefined;
    d3ReheatSimulation: () => void;
  }
} 