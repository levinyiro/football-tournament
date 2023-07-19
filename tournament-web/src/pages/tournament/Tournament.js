import { useParams } from 'react-router-dom';
import { useState } from 'react';
import './Tournament.scss';

function Tournament() {
  const { id } = useParams();
  const [actualTab, setActualTab] = useState('group');

  return (
    <div className="Tournament">
      <h1>Tournament ID: {id}</h1>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className={`nav-link ${actualTab === 'group' ? 'active' : ''}`} aria-current="page" onClick={() => setActualTab('group')}>
            Group
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${actualTab === 'knockout' ? 'active' : ''}`} onClick={() => setActualTab('knockout')}>
            Knockout
          </a>
        </li>
      </ul>

      {actualTab === 'group' && (
        <div className="tab-content">
          <h2>Group Content</h2>
          {/* Add your content specific to the "Group" tab */}
        </div>
      )}

      {actualTab === 'knockout' && (
        <div className="tab-content">
          <h2>Knockout Content</h2>
          {/* Add your content specific to the "Knockout" tab */}
        </div>
      )}
    </div>
  );
}

export default Tournament;
