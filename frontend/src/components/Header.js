/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo.png';
// import cartImg from '../assets/images/cart.png';
import { toast } from 'react-toastify';
import { useLogoutUserMutation } from "../redux/api/userAPI";

// Header Component
const Header = () => {
    const user = useSelector((state) => state.userState.user);
    const [isOpen, setIsOpen] = useState(false);
    const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const toggle = () => setIsOpen(!isOpen);

    // Effect hook to handle logout success or error notifications
    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    // Logout handler function
    const onLogoutHandler = () => {
        logoutUser();
    };

    return (
        <header>
            <div className="container">
                <Navbar expand="md" dark>
                    <NavbarBrand
                        href={
                            user ? (user.role === 'admin' ? '/admin/users' : '/profile') : '/'
                        }>
                        <img
                            src={logoImg}
                            alt="Material"
                            className="logo-image"
                        />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} className="ms-auto" style={{ color: 'white' }} />
                    <Collapse isOpen={isOpen} navbar>

                        {!user && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret style={{ color: 'white' }}>
                                            <img src={userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={() => navigate('/login')}>SIGN IN</DropdownItem>
                                            <DropdownItem onClick={() => navigate('/register')}>SIGN UP</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}

                        {user && user.role === 'user' && (
                            <>
                                <Nav className="me-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/shop')} style={{ color: 'white' }}>
                                            <button className="btn btn-gray">SHOP</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/explore')} style={{ color: 'white' }}>
                                            <button className="btn btn-gray">EXPLORE</button>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <Nav className="ms-auto" navbar>
                                    {/* <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/mycart')}>
                                            <img src={cartImg} alt="Cart" className="user-img" />
                                        </NavLink>
                                    </NavItem> */}
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret style={{ color: 'white' }}>
                                            <img src={user.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem tag={Link} to="/profile">
                                                <span className="align-middle">PROFILE</span>
                                            </DropdownItem>
                                            <DropdownItem onClick={onLogoutHandler}>SIGN OUT</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}

                        {user && user.role === 'admin' && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive px-3">
                                        <NavLink onClick={() => navigate('/admin/users')} style={{ color: 'white' }}>
                                            Users
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive px-3">
                                        <NavLink onClick={() => navigate('/admin/statistics')} style={{ color: 'white' }}>
                                            Statistics
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar className="px-3">
                                        <DropdownToggle nav caret style={{ color: 'white' }}>
                                            <img src={user.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={onLogoutHandler}>LOG OUT</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                    </Collapse>
                </Navbar>
            </div>
        </header>
    );
}

export default Header;
