import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const collapseNavbar = () => {
        // const navbarToggler = document.querySelector('.navbar-toggler');
        // const navbarCollapse = document.querySelector('.navbar-collapse');
        // navbarToggler.classList.remove('show');
        // navbarCollapse.classList.remove('show');
    }

    // here open modal
    const handleLogin = () => {
        // const jwtToken = 'your_jwt_token_here';
        // localStorage.setItem('jwtToken', jwtToken);
        // setIsLoggedIn(true);
        setShowModal(false);
    }

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
    }

    return (
        <div className="Header">
            <nav className="navbar navbar-expand-md navbar-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="seasons">Football Tournament</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent" onClick={collapseNavbar()}>
                        <ul className="navbar-nav ms-auto mb-2 mb-sm-0">
                            <li className="nav-item">
                                <a className="nav-link">Home</a>
                            </li>
                        </ul>

                        <div className="d-flex justify-content-md-end mb-2 mb-sm-0">
                            {!isLoggedIn ? (
                                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>Sign in</button>
                            ) : (
                                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sign out</button>
                            )}
                        </div>
                    </div >
                </div >
            </nav >

            {showModal === true && (
                <div className="modal">
                    <div className="modal-content">
                        {/* <form onSubmit={login()}> */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="inputUsernameEmail" className="form-label">Username</label>
                                <input required type="email" className="form-control" id="inputUsernameEmail" name="usernameEmail" />
                                <div className="invalid-feedback">Username or email is required</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="inputPassword" className="form-label">Password</label>
                                <input required type="password" className="form-control" id="inputPassword" name="password" />
                                <div className="invalid-feedback">Password is required</div>
                            </div>

                            <div className="row">
                                <div className="col-5">
                                    <button className="btn btn-primary" onClick={handleLogin()}>Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
