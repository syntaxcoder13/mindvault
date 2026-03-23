import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const TYPE_COLORS = {
  article: '#F5A623', // amber
  video: '#4A90E2',   // blue
  tweet: '#50E3C2',   // green
  pdf: '#D0021B',     // red
  image: '#BD10E0'    // purple fallback
};

export default function GraphView() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hoverNode, setHoverNode] = useState(null);
  const { fetchGraphData } = useApi();

  useEffect(() => {
    fetchGraphData().then(data => {
      setLoading(false);
      if (!data.nodes || data.nodes.length === 0) return;
      initGraph(data);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const initGraph = (data) => {
    if (!containerRef.current || !data) return;
    containerRef.current.innerHTML = ''; // reset

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // (Using imported d3 instead of window.d3)

    const nodesCopy = data.nodes.map(n => ({...n}));
    const linksCopy = data.links.map(l => ({...l}));

    // Calculate node degrees for sizing
    const degrees = {};
    nodesCopy.forEach(n => degrees[n.id] = 0);
    linksCopy.forEach(l => {
      degrees[l.source] = (degrees[l.source] || 0) + 1;
      degrees[l.target] = (degrees[l.target] || 0) + 1;
    });

    const simulation = d3.forceSimulation(nodesCopy)
        .force("link", d3.forceLink(linksCopy).id(d => d.id).strength(0.3)) // requirement setup
        .force("charge", d3.forceManyBody().strength(-200)) // requirement setup
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(containerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().on("zoom", function(event) {
             g.attr("transform", event.transform);
        }));

    const g = svg.append("g");

    const link = g.append("g")
        .attr("stroke", "var(--border-color)")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linksCopy)
      .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = g.append("g")
        .attr("stroke", "var(--bg-color)")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodesCopy)
      .join("circle")
        .attr("r", d => 5 + (degrees[d.id] || 0) * 2) // scale radius by degree
        .attr("fill", d => TYPE_COLORS[d.type] || '#FFFFFF')
        .style("cursor", "pointer")
        .call(drag(simulation))
        .on("mouseover", (event, d) => {
             d3.select(event.currentTarget).attr("stroke", "var(--accent-color)").attr("stroke-width", 3);
             setHoverNode({ data: d, x: event.clientX, y: event.clientY });
        })
        .on("mousemove", (event) => {
             setHoverNode(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
        })
        .on("mouseout", (event) => {
             d3.select(event.currentTarget).attr("stroke", "var(--bg-color)").attr("stroke-width", 1.5);
             setHoverNode(null);
        })
        .on("click", (event, d) => {
            navigate(`/item/${d.id}`);
        });

    // Labels
    const labels = g.append("g")
        .selectAll("text")
        .data(nodesCopy)
        .join("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.title.length > 20 ? d.title.substring(0, 20)+'...' : d.title)
        .attr("font-size", "10px")
        .attr("font-family", "var(--font-meta)")
        .attr("fill", "var(--text-color)")
        .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
          
      labels
          .attr("x", d => d.x)
          .attr("y", d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 150px)', position: 'relative' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>KNOWLEDGE GRAPH</h2>
      <div className="brutal-border graph-container" style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#050505', minHeight: 'calc(100vh - 200px)' }}>
        {loading && <div className="loading" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>COMPUTING GRAPH...</div>}
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      </div>

      {hoverNode && (
        <div 
          className="brutal-border"
          style={{
            position: 'fixed',
            left: hoverNode.x > window.innerWidth - 360 ? 'auto' : hoverNode.x + 15,
            right: hoverNode.x > window.innerWidth - 360 ? window.innerWidth - hoverNode.x + 15 : 'auto',
            top: hoverNode.y > window.innerHeight - 250 ? 'auto' : hoverNode.y + 15,
            bottom: hoverNode.y > window.innerHeight - 250 ? window.innerHeight - hoverNode.y + 15 : 'auto',
            background: 'rgba(10, 10, 11, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '1.25rem',
            width: '320px',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '8px 8px 0 rgba(245, 166, 35, 0.15)',
            transition: 'opacity 0.15s ease'
          }}
        >
          <div className="meta-text" style={{ color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ color: TYPE_COLORS[hoverNode.data.type] || 'var(--accent-color)' }}>{hoverNode.data.type}</span>
             {hoverNode.data.createdAt && <span>{new Date(hoverNode.data.createdAt).toLocaleDateString()}</span>}
          </div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>{hoverNode.data.title}</h4>
          
          {hoverNode.data.excerpt && (
             <p style={{ fontSize: '0.9rem', color: '#D4D4D4', marginBottom: '1rem', lineHeight: '1.5' }}>
               {hoverNode.data.excerpt}...
             </p>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
             {hoverNode.data.tags?.slice(0,3).map(t => (
               <span key={t} className="tag-badge" style={{ fontSize: '0.65rem' }}>{t}</span>
             ))}
             {hoverNode.data.tags?.length > 3 && <span className="tag-badge" style={{ fontSize: '0.65rem' }}>+{hoverNode.data.tags.length - 3}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
