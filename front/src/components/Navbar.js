import React, { useState } from 'react';
//import {ReactComponent as Search} from '../icons/search.svg';
//import {ReactComponent as Cluster} from '../icons/cluster.svg';
//import {ReactComponent as Path} from '../icons/path.svg';
//import {ReactComponent as Compare} from '../icons/compare.svg';
//import {ReactComponent as Filter} from '../icons/filter.svg';
//import {ReactComponent as Export} from '../icons/export.svg';
//import {ReactComponent as Animation} from '../icons/animation.svg';
//import {ReactComponent as Reset} from '../icons/reset.svg';

import './Navbar.css';
import Cluster from '../icons/Cluster';
import Search from '../icons/Search';
import Path from '../icons/Path';
import Compare from '../icons/Compare';
import Filter from '../icons/Filter';
import Export from '../icons/Export';
import Animation from '../icons/Animation';
import Reset from '../icons/Reset';
import SearchField from './SearchField';

const Navbar = ({ focusNode, handleSearch, setGraphData, graphData }) => {
  const isButtonDisabled = focusNode === null;
  const [suggestions, setSuggestions] = useState(graphData.nodes.map(n => n.name));

  const handleClusterClick = () => {
    const filteredLinks = graphData.links.filter(l => l.source === focusNode.id || l.target === focusNode.id);
    const uids = Array.from(
      filteredLinks.reduce((set, link) => {
        set.add(link.source);
        set.add(link.target);
        return set;
      }, new Set())
    );
    const filteredNodes = graphData.nodes.filter(n => uids.find(id => id === n.id));
    setGraphData({
      nodes: filteredNodes,
      links: filteredLinks,
    })
  };
  
  return (
    <nav className="navbar">
      <div className="title">Graphe des collaborations</div>
      <SearchField onSearch={handleSearch} suggestions={suggestions} />
      <div className="toolbar">
        <button>
          <Search fill="#A6A6A6" className='search-logo'/>
        </button>
        <button onClick={handleClusterClick} disabled={isButtonDisabled} className={isButtonDisabled ? 'disabled' : ''}>
          <Cluster fill={isButtonDisabled ? '#3A3A3A' : '#A6A6A6'}/>
        </button>
        <button disabled={isButtonDisabled}>
          <Path fill={isButtonDisabled ? '#3A3A3A' : '#A6A6A6'}/>
        </button>
        <button>
          <Compare fill="#A6A6A6"/>
        </button>
        <button>
          <Filter fill="#A6A6A6"/>
        </button>
        <button>
          <Export fill="#A6A6A6"/>
        </button>
        <button>
          <Animation fill="#A6A6A6"/>
        </button>
        <button>
          <Reset fill="#A6A6A6"/>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;