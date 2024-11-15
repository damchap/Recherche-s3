import React, { useState } from 'react';
import authorLogo from '../icons/author-logo.png';
import affiliationLogo from '../icons/affiliation-logo.png';
import publicationsLogo from '../icons/publications-logo.png';
import groupLogo from '../icons/group-logo.png';
import mostFrequentCollaboratorLogo from '../icons/most-frequent-collaborator-logo.png';
import degreeCentralityLogo from '../icons/degree-centrality-logo.png';
import betweennessCentralityLogo from '../icons/betweenness-centrality-logo.png';
import closenessCentralityLogo from '../icons/closeness-centrality-logo.png';
import clusteringCoefficientLogo from '../icons/clustering-coefficient-logo.png';
import data from '../data/graph_partition_data.json';
import './Panel.css';

const Panel = ({ node, colourPalette }) => {
  const [isOpen, setIsOpen] = useState(true);

  const groupColor = colourPalette[node.group] || '#FFF'; 
  const collaboratorColor = colourPalette[data.nodes.find(n => n.name === node.most_frequent_collaborator).group];
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="panel-toggle" onClick={togglePanel}>
        <div
          className="toggle-icon"
          style={{ 
            color: groupColor, 
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' 
          }}
        >
          &#9654;
        </div>
      </div>

      <div className="panel-section thumbnail">
        <img src={node.image} alt="Node Thumbnail" className="thumbnail-img" />
      </div>

      <div className="panel-section profile">
        <h3 className="profile-title" style={{ color: groupColor }}>Profile</h3>
        <div className="profile-item">
          <img src={authorLogo} alt="Author Logo" className="icon" />
          <span>{node.name}</span>
        </div>
        <div className="profile-item">
          <img src={affiliationLogo} alt="Affiliation Logo" className="icon" />
          <span>{node.group}</span>
        </div>
        <div className="profile-item">
          <img src={publicationsLogo} alt="Publications Logo" className="icon" />
          <span>{node.publications_count}</span>
        </div>
      </div>

      <div className="panel-section network">
        <h3 className="network-title" style={{ color: groupColor }}>Network</h3>
        <div className="network-item-container">
          <div className="network-item-container-1">
            <div className="network-item">
              <img src={groupLogo} alt="Group Logo" className="icon" />
              <span style={{ backgroundColor: groupColor, color: '#FFF', padding: '2px 5px', borderRadius: '4px' }}>
                {`Group ${node.group}`}
              </span>
            </div>
            <div className="network-item">
              <img src={degreeCentralityLogo} alt="Degree Centrality Logo" className="icon" />
              <span>{Math.round(node.degree_centrality * 100) / 100}</span>
            </div>
            <div className="network-item">
              <img src={betweennessCentralityLogo} alt="Betweenness Centrality Logo" className="icon" />
              <span>{Math.round(node.betweenness_centrality * 100) / 100}</span>
            </div>
          </div>
          <div className="network-item-container-2">
            <div className="network-item">
              <img src={mostFrequentCollaboratorLogo} alt="Most Frequent Collaborator Logo" className="icon" />
              <span style={{ backgroundColor: collaboratorColor, color: '#FFF', padding: '2px 5px', borderRadius: '4px' }}>
                {node.most_frequent_collaborator}
              </span>
            </div>
            <div className="network-item">
              <img src={closenessCentralityLogo} alt="Closeness Centrality Logo" className="icon" />
              <span>{Math.round(node.closeness_centrality * 100) / 100}</span>
            </div>
            <div className="network-item">
              <img src={clusteringCoefficientLogo} alt="Clustering Coefficient Logo" className="icon" />
              <span>{Math.round(node.clustering_coefficient * 100) / 100}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;