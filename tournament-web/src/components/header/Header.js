import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Data from '../../data/Data';
import './Header.scss';

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const collapseNavbar = () => {
        // const navbarToggler = document.querySelector('.navbar-toggler');
        // const navbarCollapse = document.querySelector('.navbar-collapse');
        // navbarToggler.classList.remove('show');
        // navbarCollapse.classList.remove('show');
    }

    // here open modal
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
        console.log('open');
        setShowModal(true);
    }

    const closeModal = () => {
        setUsername('');
        setPassword('');
        setShowModal(false);
    }

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
    }

    return (
        <div className="Header">
            <nav className="navbar navbar-expand-md navbar-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Football Tournament</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent" onClick={collapseNavbar()}>
                        <ul className="navbar-nav ms-auto mb-2 mb-sm-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                        </ul>

                        <div className="d-flex justify-content-md-end mb-2 mb-sm-0">
                            {!isLoggedIn ? (
                                <button className="btn btn-primary btn-sm" onClick={() => showModalFunc()}>Sign in</button>
                            ) : (
                                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sign out</button>
                            )}
                        </div>
                    </div >
                </div >
            </nav >

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
