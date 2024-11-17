import { Button, Container, Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import React from "react";
import UserInfo from "../../types/auth/UserInfo";
import { logout } from "../../services/auth/AuthSlice";
import { Outlet } from "react-router";

interface MainNavbarProps {
  user: UserInfo;
}

function MainNavbar({ user }: MainNavbarProps): JSX.Element {
  const dispatch = useAppDispatch();

  const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(logout());
  };

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>CS411 Project</Navbar.Brand>
          <Nav className="me-auto"></Nav>
          <NavbarBrand>{user.username}</NavbarBrand>
          <Button onClick={handleLogoutClick}>Logout</Button>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default MainNavbar;
