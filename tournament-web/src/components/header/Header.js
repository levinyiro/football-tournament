import './Header.scss';

function Header() {

    const collapseNavbar = () => {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarToggler.classList.remove('show');
        navbarCollapse.classList.remove('show');
    }

    return (
        <div className="Header">
            <nav class="navbar navbar-expand-md navbar-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="seasons">Football Tournament</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent" onClick={collapseNavbar()}>
                        <ul class="navbar-nav ms-auto mb-2 mb-sm-0">
                            <li class="nav-item">
                                <a class="nav-link" routerLinkActive="active" routerLink="seasons">Home</a>
                            </li>
                        </ul>

                        <div className="d-flex justify-content-md-end mb-2 mb-sm-0">
                            {!isLoggedIn ? (
                                <button className="btn btn-primary btn-sm" onClick={handleLogin}>Sign in</button>
                            ) : (
                                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sign out</button>
                            )}
                        </div>
                    </div >
                </div >
            </nav >
        </div >
    );
}

export default Header;
