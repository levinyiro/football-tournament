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

      <ul className="nav nav-pills">
        <li className="nav-item">
          <a className={`nav-link tournament-nav-link ${actualTab === 'group' ? 'active' : ''}`} aria-current="page" onClick={() => setActualTab('group')}>
            Group
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link tournament-nav-link ${actualTab === 'knockout' ? 'active' : ''}`} onClick={() => setActualTab('knockout')}>
            Knockout
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link tournament-nav-link ${actualTab === 'matches' ? 'active' : ''}`} onClick={() => setActualTab('matches')}>
            Matches
          </a>
        </li>
      </ul>

      {actualTab === 'group' && (
        <div className="tab-content">
          <h2>Group Content</h2>
          
          <div class="container card p-5">
            <h3>Group A</h3>
            <table>
              <thead>
                <th>Pos</th>
                <th>Name</th>
                <th>Team</th>
                <th>Games Played</th>
                <th>Won</th>
                <th>Draw</th>
                <th>Lose</th>
                <th>Points</th>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="container card my-5 p-5">
            <h3>Group B</h3>
            <table class="table table-striped">
              <thead>
                <th>Pos</th>
                <th>Name</th>
                <th>Team</th>
                <th>Games Played</th>
                <th>Won</th>
                <th>Draw</th>
                <th>Lose</th>
                <th>Points</th>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{fontWeight: 'bold'}}>{ 2 * 3 + 3 }</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {actualTab === 'knockout' && (
        <div className="tab-content">
          <h2>Knockout Content</h2>
          {/* Add your content specific to the "Knockout" tab */}
        </div>
      )}

      {actualTab === 'matches' && (
        <div className="matches-tab">
          <h2>Matches Content</h2>
          <div class="container card p-5">
            <div className='row mb-3'>
              <div className='col-5 text-end'>Levi</div>
              <div className='col-2 text-center'>-</div>
              <div className='col-5 text-start'>Dani</div>
            </div>

            <div className='row'>
              <div className='col-5 text-end'>3</div>
              <div className='col-2 text-center'>:</div>
              <div className='col-5 text-start'>3</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tournament;
