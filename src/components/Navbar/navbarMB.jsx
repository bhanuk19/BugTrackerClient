import React, { useState } from "react";
import { Icon, Menu, Sidebar, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
function Overlay() {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.795)",
        position: "fixed",
        height: "110vh",
        width: "100%",
        zIndex: "2",
      }}
    />
  );
}

function HamIcon() {
  return <i className="big bars icon inverted" />;
}

function CloseIcon() {
  return <i className="big close red icon" style={{ zIndex: 2 }} />;
}
function NavbarMb({ logged, destroySession }) {
  const cookie = new Cookies();
  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState(HamIcon);
  const [activeItem, setactiveItem] = useState("home");
  const handleItemClick = (e, { name }) => {
    setactiveItem(name);
    visible ? hideSidebar() : showSidebar();
  };
  const hideSidebar = () => {
    setIcon(HamIcon);
    setVisible(false);
  };
  const showSidebar = () => {
    setIcon(CloseIcon);
    setVisible(true);
  };
  const toggleSidebar = () => {
    visible ? hideSidebar() : showSidebar();
  };
  return (
    <>
      {visible && <Overlay />}
      <Menu inverted size="tiny" borderless attached>
        <Menu.Menu position="right">
          <Menu.Item onClick={toggleSidebar}>{icon}</Menu.Item>
        </Menu.Menu>
      </Menu>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={visible}
        width="thin"
        style={{ width: "60%" }}
      >
        {logged ? (
          <>
            <Menu.Menu position="right">
              <Dropdown
                text={cookie.get("username")}
                simple
                className="link item"
                direction="right"
                style={{ fontSize: "20px" }}
              >
                <Dropdown.Menu>
                  <Dropdown.Header>Action Center</Dropdown.Header>
                  <Dropdown.Item as={Link} to="profile/bugs">
                    Your Bugs
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="profile/fixes">
                    Your Fixes
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Bye....</Dropdown.Header>
                  <Dropdown.Item
                    name="Logout"
                    active={activeItem === "Logout"}
                    onClick={destroySession}
                    position="right"
                    style={{ background: "#BB3F3F" }}
                  >
                    Logout{" "}
                    <Icon name="log out" style={{ marginLeft: "5px" }}></Icon>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
            <Menu.Item
              name="Dashboard"
              active={activeItem === "Dashboard"}
              onClick={handleItemClick}
              as={Link}
              to="dashboard"
              className="home-link"
            />
            {cookie.get("admin") === "true" ? (
              <>
                <Menu.Item
                  name="Fixes"
                  active={activeItem === "Fixes"}
                  onClick={handleItemClick}
                  as={Link}
                  to="fixes"
                />
                <Menu.Item
                  name="Reported"
                  active={activeItem === "Reported"}
                  onClick={handleItemClick}
                  as={Link}
                  to="reported"
                />
                <Menu.Item
                  name="Analytics"
                  active={activeItem === "Analytics"}
                  onClick={handleItemClick}
                  as={Link}
                  to="analytics"
                />
              </>
            ) : (
              <></>
            )}
            <Menu.Item
              name="Assigned"
              active={activeItem === "Assigned"}
              onClick={handleItemClick}
              as={Link}
              to="assigned"
            />
            <Menu.Item
              name="Report"
              active={activeItem === "Report"}
              onClick={handleItemClick}
              as={Link}
              to="report"
            />
          </>
        ) : (
          <Menu.Item
            name="Login"
            active={activeItem === "Login"}
            as={Link}
            to="authenticate"
            position="right"
          />
        )}
      </Sidebar>
    </>
  );
}

export default NavbarMb;
