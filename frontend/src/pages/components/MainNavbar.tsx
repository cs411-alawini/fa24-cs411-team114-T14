import { Button, Container, Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import React, { useEffect } from "react";
import UserInfo from "../../types/auth/UserInfo";
import { logout } from "../../services/auth/AuthSlice";
import { Outlet } from "react-router";
import { fetchUserInputs } from "../../services/userinput/UserInputSlice";

interface MainNavbarProps {
  user: UserInfo;
  links: { name: string; path: string }[];
}

function MainNavbar({ user, links }: MainNavbarProps): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserInputs());
  }, [dispatch]);

  const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(logout());
  };

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>CS411 Project</Navbar.Brand>
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link key={link.path} href={link.path}>
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
          <NavbarBrand>{user.username}</NavbarBrand>
          <Button onClick={handleLogoutClick}>Logout</Button>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default MainNavbar;
