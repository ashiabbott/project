import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

interface SankeyData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

const FinancialSankey: React.FC<{ data: SankeyData }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 500;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const sankeyGenerator = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [width - 1, height - 6],
      ]);

    const { nodes, links } = sankeyGenerator(data);

    svg.selectAll('*').remove();

    svg
      .append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', '#69b3a2')
      .attr('opacity', 0.8)
      .append('title')
      .text(d => `${d.name}\n${d.value}`);

    svg
      .append('g')
      .attr('fill', 'none')
      .selectAll('g')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', d => Math.max(1, d.width))
      .append('title')
      .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

    svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
      .text(d => d.name);
  }, [data]);

  return <svg ref={svgRef} />;
};

export default FinancialSankey;
