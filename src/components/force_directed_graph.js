import React, { Component } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { min, max } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceX, forceY } from 'd3-force';
import { drag } from 'd3-drag';

export default class ForceDirectedGraph extends Component {
  constructor(props){
    super(props);
    this.createForceDirectedGraph = this.createForceDirectedGraph.bind(this);
  }
  componentDidMount() {
    this.createForceDirectedGraph()
  }
  componentDidUpdate() {
    this.createForceDirectedGraph()
  }
  createForceDirectedGraph() {

    const nod = this.nod;
    const data = this.props.data;

    let m = { top: 0, right: 0, bottom: 0, left: 0 };

    const width = this.props.size[0] - m.left - m.right;
    const height = this.props.size[1] - m.top - m.bottom;

    var visual = select('.visual');

    var svg = visual.append('svg')
      .attr('width', width)
      .attr('height', height);

    var simulation = forceSimulation()
        .force('link', forceLink().id(function(d, i) { return i; }))
        .force('charge', forceManyBody())
        .force('x', forceX().strength(0.025))
        .force('y', forceY().strength(0.06))
        .force('center', forceCenter(width / 2, height / 2));

    var link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line');

    var node = svg.append('g')
      .attr('class', 'flags')
      .selectAll('image')
      .data(data.nodes)
      .enter().append('image')
        .attr('class', 'flag')
        .attr('xlink:href', d => `../img/svg-flags/${d.code}.svg`)
        .attr('width', 16)
        .attr('height', 12)
        .call(drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.country; });

    simulation
        .nodes(data.nodes)
        .on('tick', ticked);

    simulation.force('link')
      .links(data.links);

    function ticked() {

      link
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      node
          .attr('x', function(d) { return d.x - 8; })
          .attr('y', function(d) { return d.y - 6; });

    }

    function dragstarted(d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const styles = select('svg')
      .append('style')
      .text(' \
        .links line { \
          stroke: #aaa; \
        } \
      ');

  }
  render() {
    return (
      <div className="visual">
      </div>
    );
   }
}
