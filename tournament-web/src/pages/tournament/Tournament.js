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
        <div className="tab-content mb-5">
          <div class="container card p-5 mt-5">
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

          <div class="container card p-5 mt-5">
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
        <div className="knockout-tab mb-5">
          <h3 className='text-center mt-5 lead'>Semi-final</h3>
          <div class="container card mt-4">
            <div className='row d-flex align-items-center p-3'>
              <div className='col-4 text-center team winner'>
                <h4>Levi</h4>
                <p>Manchester City</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>4 - 3</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h4>Kapocsi</h4>
                <p>Paris Saint-Germain</p>
              </div>
            </div>

            <hr className='m-1' />

            <div className='row d-flex align-items-center p-3'>
              <div className='col-4 text-center team'>
                <h4>Zsombor</h4>
                <p>Manchester United</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>0 - 1</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team winner'>
                <h4>Lancz</h4>
                <p>AC Milan</p>
              </div>
            </div>
          </div>

          <h3 className='text-center mt-5 lead'>Play-off</h3>
          <div class="container card p-3 mt-4 gold">
            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team winner'>
                <h4>Levi</h4>
                <p>Manchester City</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>2 - 1</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h4>Lancz</h4>
                <p>AC Milan</p>
              </div>
            </div>
          </div>

          <h3 className='text-center lead mt-5'>Third place</h3>
          <div class="container card p-3 mt-4 bronze">
            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team winner'>
                <h4>Kapocsi</h4>
                <p>Paris Saint-Germain</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>1 - 0</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h4>Zsombor</h4>
                <p>Manchester United</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {actualTab === 'matches' && (
        <div className="matches-tab">
          <div class="container card p-3 mt-5">
            <div className='row d-flex align-items-center'>
              <div className='col-4 text-center team winner'>
                <h4>Kapocsi</h4>
                <p>Paris Saint-Germain</p>
              </div>
              <div className='col-1'></div>
              <div className='col-2 result py-2 text-center'>1 - 0</div>
              <div className='col-1'></div>
              <div className='col-4 text-center team'>
                <h4>Zsombor</h4>
                <p>Manchester United</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tournament;
