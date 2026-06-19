import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useProject } from '../../context/ProjectContext';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'code' | 'category';
  color: string;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export function TheoryGraph() {
  const { state } = useProject();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 400;
    const height = 280;

    const nodes: GraphNode[] = [
      ...state.codes.filter((c) => c.kind === 'code').map((c) => ({
        id: c.id,
        label: c.name,
        type: 'code' as const,
        color: c.color,
      })),
      ...state.categories.map((cat) => ({
        id: cat.id,
        label: cat.name,
        type: 'category' as const,
        color: '#2563eb',
      })),
    ];

    const links: GraphLink[] = [];
    state.categories.forEach((cat) => {
      cat.codeIds.forEach((codeId) => links.push({ source: codeId, target: cat.id }));
      cat.relatedCategoryIds.forEach((relId) =>
        links.push({ source: cat.id, target: relId })
      );
    });

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1.5);

    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    node
      .append('circle')
      .attr('r', (d) => (d.type === 'category' ? 14 : 8))
      .attr('fill', (d) => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node
      .append('text')
      .text((d) => d.label)
      .attr('x', 12)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('fill', '#374151');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (typeof d.source === 'object' ? d.source.x : 0) ?? 0)
        .attr('y1', (d) => (typeof d.source === 'object' ? d.source.y : 0) ?? 0)
        .attr('x2', (d) => (typeof d.target === 'object' ? d.target.x : 0) ?? 0)
        .attr('y2', (d) => (typeof d.target === 'object' ? d.target.y : 0) ?? 0);
      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [state.codes, state.categories]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-1">Category & Code Network</h4>
      <p className="text-xs text-gray-500 mb-3">
        Visual map of axial relationships — open codes linked to higher-order categories.
      </p>
      <svg ref={svgRef} width="100%" height={280} className="bg-gray-50 rounded-lg" />
    </div>
  );
}
