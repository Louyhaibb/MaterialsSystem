/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo-2.png';
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
                            user ? (user.role === 'admin' ? '/admin/users' : user.role === 'company' ? '/company/services' : '/client/companies') : '/'
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
                                            <DropdownItem onClick={() => navigate('/login')}>Login</DropdownItem>
                                            <DropdownItem onClick={() => navigate('/register')}>Register</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}

                        {user && user.role === 'client' && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/client/companies')} style={{ color: 'white' }}>
                                            Transfer Company
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/client/services')} style={{ color: 'white' }}>
                                            Services
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/client/orders')} style={{ color: 'white' }}>
                                            Orders
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret style={{ color: 'white' }}>
                                            <img src={user.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem tag={Link} to="/client/profile">
                                                <span className="align-middle">Profile</span>
                                            </DropdownItem>
                                            <DropdownItem onClick={onLogoutHandler}>Logout</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                        {user && user.role === 'company' && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/company/services')} style={{ color: 'white' }}>
                                            Sevices
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/company/additional-services')} style={{ color: 'white' }}>
                                            Additional Sevices
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/company/orders')} style={{ color: 'white' }}>
                                            Orders
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret style={{ color: 'white' }}>
                                            <img src={user.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem tag={Link} to="/company/profile">
                                                <span className="align-middle">Profile</span>
                                            </DropdownItem>
                                            <DropdownItem onClick={onLogoutHandler}>Logout</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                        {user && user.role === 'admin' && (
                            <>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/admin/users')} style={{ color: 'white' }}>
                                            Users
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive px-1">
                                        <NavLink onClick={() => navigate('/admin/statistics')} style={{ color: 'white' }}>
                                            Statistics
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar className="px-1">
                                        <DropdownToggle nav caret style={{ color: 'white' }}>
                                            <img src={user.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={onLogoutHandler}>Logout</DropdownItem>
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
