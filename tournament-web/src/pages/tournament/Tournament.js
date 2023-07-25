import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Tournament.scss';

function Tournament() {
  const { id } = useParams();
  const [ actualTab, setActualTab ] = useState('group');
  const { isLoggedIn, setIsLoggedIn } = useAuth();

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
        <li className="nav-item">
          <a className={`nav-link ${actualTab === 'matches' ? 'active' : ''}`} onClick={() => setActualTab('matches')}>
            Matches
          </a>
        </li>
      </ul>

      {actualTab === 'group' && (
        <div className="tab-content">
          {isLoggedIn && (
            <h2>Hats</h2>
          )}
          <h2>Group Content</h2>
        </div>
      )}

      {actualTab === 'knockout' && (
        <div className="tab-content">
          <h2>Knockout Content</h2>
          {/* Add your content specific to the "Knockout" tab */}
        </div>
      )}

      {actualTab === 'matches' && (
        <div className="tab-content">
          <h2>Matches Content</h2>
          {/* Add your content specific to the "Matches" tab */}
        </div>
      )}
    </div>
  );
}

export default Tournament;
