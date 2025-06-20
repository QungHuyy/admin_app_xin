import React, { useContext } from 'react';
import Logoicon from '../Image/1.jpg'
import Logotext from '../Image/logo-text.png'
import Logolight from '../Image/logo-light-text.png'
import { AuthContext } from '../context/Auth'

function Header(props) {
    const { jwt, user, logOut } = useContext(AuthContext);
    return (
        <div>
            {
                jwt && user ?
                    (<header className="topbar" data-navbarbg="skin6">
                        <nav className="navbar top-navbar navbar-expand-md">
                            <div className="navbar-header" data-logobg="skin6">
                                <a className="nav-toggler waves-effect waves-light d-block d-md-none" href="#"><i
                                    className="ti-menu ti-close"></i></a>
                                <div className="navbar-brand" style={{marginTop:'30px',marginLeft:'-10px'}}>
                                    <a style={{display:'flex',alignItems:'center'}} href="index.html">
                                        <b className="logo-icon">
                                            <img src={Logoicon} alt="trang chủ" style={{width:'230px'}} />
                                        </b>
                                      <p></p>
                                    </a>
                                </div>
                                <a className="topbartoggler d-block d-md-none waves-effect waves-light" href="#"
                                    data-toggle="collapse" data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><i
                                        className="ti-more"></i></a>
                            </div>
                            <div className="navbar-collapse collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i data-feather="settings" className="svg-icon"></i>
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <a className="dropdown-item" href="#">Hành động</a>
                                            <a className="dropdown-item" href="#">Hành động khác</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#">Tùy chọn khác</a>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="navbar-nav float-right">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">
                                            <span className="ml-2 d-none d-lg-inline-block"><span>Xin chào,</span> <span
                                                className="text-dark">{user ? user.fullname : ""}</span> <i data-feather="chevron-down"
                                                    className="svg-icon"></i></span>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                                            <button className="dropdown-item" onClick={() => { logOut() }}><i data-feather="power"
                                                className="svg-icon mr-2 ml-1"></i>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </header>) :
                    (
                        <div></div>
                    )}
        </div>

    );
}

export default Header;