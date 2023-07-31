import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Tournament.scss';

function Tournament() {
  const { id } = useParams();
  const [actualTab, setActualTab] = useState('group');
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  return (
    <div className="Tournament container">
      <h1 class="mb-3">Tournament ID: {id}</h1>

      <ul className="nav nav-pills mb-3">
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

          <div class="container card p-5 mb-5">
            <h3 style={{ fontWeight: 900 }}>Group A</h3>
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
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="container card p-5 mb-5">
            <h3 style={{ fontWeight: 900 }}>Group B</h3>
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
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>Levi</td>
                  <td>Manchester United</td>
                  <td>6</td>
                  <td>2</td>
                  <td>3</td>
                  <td>1</td>
                  <td style={{ fontWeight: 'bold' }}>{2 * 3 + 3}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {actualTab === 'knockout' && (
        <div className="knockout-tab">
          <h2 className='mb-5'>Knockout Content</h2>

          <h3 className='text-center mb-4 lead'>Semi-final</h3>
          <div class="container card p-4 mb-4">
            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team winner'>
                <h3>Levi</h3>
                <p>Manchester City</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>4 - 3</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h3>Kapocsi</h3>
                <p>Paris Saint-Germain</p>
              </div>
            </div>

            <hr className='m-4' />

            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team'>
                <h3>Zsombor</h3>
                <p>Manchester United</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>0 - 1</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team winner'>
                <h3>Lancz</h3>
                <p>AC Milan</p>
              </div>
            </div>
          </div>

          <h3 className='text-center mb-4 lead mt-5'>Play-off</h3>
          <div class="container card p-4 mb-4 gold">
            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team winner'>
                <h3>Levi</h3>
                <p>Manchester City</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>2 - 1</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h3>Lancz</h3>
                <p>AC Milan</p>
              </div>
            </div>
          </div>

          <h3 className='text-center mb-4 lead mt-5'>Third place</h3>
          <div class="container card p-4 mb-4 bronze">
            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team winner'>
                <h3>Kapocsi</h3>
                <p>Paris Saint-Germain</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>1 - 0</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h3>Zsombor</h3>
                <p>Manchester United</p>
              </div>
            </div>
          </div>
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
