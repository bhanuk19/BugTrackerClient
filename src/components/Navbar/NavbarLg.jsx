import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon, Menu, Segment, Dropdown } from "semantic-ui-react";
import Cookies from "universal-cookie";
export default function NavbarLg({ destroySession, logged, setVisibility }) {
  const cookie = new Cookies();
  const [nav, setNav] = useState(false);
  const [activeItem, setactiveItem] = useState("Home");
  const handleScroll = (e) => {
    if (window.pageYOffset > 80) {
      if (nav === false) {
        setNav(true);
      }
    } else {
      if (nav) {
        setNav(false);
      }
    }
  };
  
  useEffect(() => {
    setactiveItem(false);
  }, [nav, activeItem]);
  window.addEventListener("scroll", handleScroll);
  const handleItemClick = (e, { name }) => {
    setactiveItem(name);
  };
  const navStyle = {
    position: "fixed",
    top: "0",
    height: "fit-content",
    zIndex: "5",
    padding: "0px 5px",
  };
  return (
    <Segment
      inverted
      attached
      size="mini"
      style={nav ? navStyle : { padding: "0px 5px" }}
    >
      <Menu inverted secondary>
        {logged ? (
          <>
            <Menu.Item
              name="Home"
              active={activeItem === "Home"}
              onClick={handleItemClick}
              as={NavLink}
              to="home"
              className="home-link"
            />

            <>
              <Menu.Item
                name="Projects"
                active={activeItem === "Projects"}
                onClick={handleItemClick}
                as={NavLink}
                to="projects"
              />
              <Menu.Item
                name="Issues"
                active={activeItem === "Issues"}
                onClick={handleItemClick}
                as={NavLink}
                to="issues"
              />
            </>
            <Menu.Item
              name="Assigned"
              active={activeItem === "Assigned"}
              onClick={handleItemClick}
              as={NavLink}
              to="assigned"
            />
            <Menu.Item
              style={{
                background: "#0884E8",
                color: " #fff!important",
              }}
              onClick={() => {
                setVisibility(true);
              }}
            >
              Create Issue
              <Icon
                name="plus"
                style={{ color: "#fff", marginLeft: "5px" }}
              ></Icon>
            </Menu.Item>
            <Menu.Item position="right">
              <Dropdown
                text={cookie.get("username")}
                pointing
                className="link item"
              >
                <Dropdown.Menu>
                  <Dropdown.Header>Action Center</Dropdown.Header>
                  <Dropdown.Item as={NavLink} to="profile/bugs">
                    Your Bugs
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
            </Menu.Item>
          </>
        ) : (
          <Menu.Item
            name="Login"
            active={activeItem === "Login"}
            as={NavLink}
            to="authenticate"
            position="right"
          />
        )}
      </Menu>
    </Segment>
  );
}
