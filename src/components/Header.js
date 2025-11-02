import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Data from '../data/Data';

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await Data.login(username, password);
        
        if (!res) {
            // error
        } else {
            setUsername('');
            setIsLoggedIn(true);
            setShowModal(false);
        }
        setPassword('');

    }

    const showModalFunc = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setUsername('');
        setPassword('');
        setShowModal(false);
    }

    const handleLogout = () => {
        console.log('logout');
        localStorage.removeItem('loggedIn');
        setIsLoggedIn(false);
    }

    return (
        <div className="Header">
            <nav>
                <div className="container-fluid d-flex justify-content-between align-items-center my-2">
                    <span className="navbar-brand mb-0 ms-1" onClick={() => window.location = '/'}>Football</span>
                    <div>
                        {isLoggedIn ?
                            <button className="btn btn-outline-light btn-sm" onClick={() => handleLogout()}>Logout</button>
                            :
                            <button className="btn btn-outline-light btn-sm" onClick={() => showModalFunc()}>Login</button>
                        }
                    </div>
                </div>
            </nav>

            <Modal onHide={() => closeModal()} show={showModal}>
                <Modal.Header closeButton style={{ border: 0 }}>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="inputUsername" className="form-label">Username</label>
                            <input required type="text" className="form-control" id="inputUsername" name="username" value={username} onChange={e => setUsername(e.target.value)} />
                            <div className="invalid-feedback">Username is required</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputPassword" className="form-label">Password</label>
                            <input required type="password" className="form-control" id="inputPassword" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <div className="invalid-feedback">Password is required</div>
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <button className="btn btn-primary">Login</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Header;
