/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { CreateProject } from "./modals";
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Menu,
  Table,
} from "semantic-ui-react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import * as R from "ramda";
import _ from "lodash";

export default function Projects() {
  const cookies = new Cookies();
  const project = useParams().projectID;
  const [currentProject, setCurrentProject] = useState(false);
  const [projects, setProjects] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState(false);
  const [activeItem, setactiveItem] = useState("");
  function userReducer(state, action) {
    switch (action.type) {
      case "CHANGE_SORT":
        if (state.column === action.column) {
          return {
            ...state,
            data: state.data.slice().reverse(),
            direction:
              state.direction === "ascending" ? "descending" : "ascending",
          };
        }

        return {
          column: action.column,
          data: _.sortBy(state.data, [action.column]),
          direction: "ascending",
        };
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = useReducer(userReducer, {
    column: null,
    data: projectMembers,
    direction: null,
  });
  const { column, data, direction } = state;
  const getProjects = () => {
    axios.get("/projects").then((resp) => {
      setProjects(resp.data);
      if (project) {
        let curr = R.find(R.propEq("projectID", project), resp.data);
        setCurrentProject(curr);
        axios
          .get("https://backflipt-accounts.onrender.com/users")
          .then((users) => {
            if (curr.projectMembers[0] === "all") {
              state.data = users.data;
              setProjectMembers(users.data);
              return;
            }
            setProjectMembers(
              R.filter(
                R.pipe(
                  R.prop("username"),
                  R.flip(R.includes)(curr.projectMembers)
                )
              )(users.data)
            );
            state.data = R.filter(
              R.pipe(
                R.prop("username"),
                R.flip(R.includes)(curr.projectMembers)
              )
            )(users.data);
          });
      }
    });
  };
  const handleItemClick = (e, { name }) => {
    setactiveItem(name);
  };
  useEffect(() => {
    if (!open) getProjects();
  }, [open]);
  useEffect(() => {
    setOpen(false);
    setactiveItem(false);
    if (project) {
      setCurrentProject(R.find(R.propEq("projectID", project), projects));
    }
  }, [activeItem]);
  useEffect(() => {
    if (currentProject) {
      axios
        .get("https://backflipt-accounts.onrender.com/users")
        .then((users) => {
          if (currentProject.projectMembers[0] === "all") {
            state.data = users.data;
            setProjectMembers(users.data);
            return;
          }
          setProjectMembers(
            R.filter(
              R.pipe(
                R.prop("username"),
                R.flip(R.includes)(currentProject.projectMembers)
              )
            )(users.data)
          );
          state.data = R.filter(
            R.pipe(
              R.prop("username"),
              R.flip(R.includes)(currentProject.projectMembers)
            )
          )(users.data);
        });
    }
  }, [currentProject]);
  useEffect(() => {});
  const navigate = useNavigate();

  return (
    <Grid columns={2} style={{ height: "99vh" }}>
      <Grid.Row
        style={{
          height: "89vh",
          position: "relative",
          paddingTop: "0",
          marginTop: "14px",
        }}
      >
        {projects ? (
          <>
            <Grid.Column
              width={4}
              style={{
                height: "100%",
                paddingTop: "10px",
                paddingLeft: "20px",
                paddingRight: "0px",
                overflowY: "hidden",
                position: "fixed",
                zIndex: "5",
                marginTop: "55px",
              }}
            >
              <Header>
                Projects
                {cookies.get("admin") === "true" ? (
                  <Button
                    style={{
                      height: "100%",
                      background: "#0069D9",
                      color: "#fff",
                      marginLeft: "20px",
                    }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Project{" "}
                    <Icon name="plus" style={{ marginLeft: "5px" }}></Icon>
                  </Button>
                ) : (
                  <></>
                )}
              </Header>
              <Dropdown
                defaultValue={""}
                options={
                  projects
                    ? [
                        { key: "none", text: "Select Project", value: "" },
                        ...projects.map((project, index) => {
                          return {
                            key: index,
                            text: project.projectName,
                            value: project.projectID,
                          };
                        }),
                      ]
                    : [{ key: "none", text: "Select Project", value: "" }]
                }
                search
                selection
                onChange={(e, { value }) => {
                  if (value.trim() === "") navigate("/projects");
                  setCurrentProject(
                    R.find(R.propEq("projectID", value), projects)
                  );
                  navigate("/projects/" + value);
                }}
                placeholder="Search Project..."
                noResultsMessage="Try another search."
              />
              {projects ? (
                <Menu
                  vertical
                  style={{ width: "100%", maxHeight: "68%", overflowY: "auto" }}
                >
                  {projects.map((project, index) => {
                    return (
                      <Menu.Item
                        key={index}
                        name={project.projectName}
                        active={activeItem === project.projectName}
                        as={NavLink}
                        to={"/projects/" + project.projectID}
                        onClick={handleItemClick}
                      >
                        {project.projectName} <Icon name="arrow right"></Icon>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              ) : (
                <></>
              )}
            </Grid.Column>
            <Grid.Column
              width={12}
              style={{
                padding: "0",
                overflowY: "hidden",
                right: "0",
                position: "absolute",
              }}
            >
              {!project ? (
                <>
                  <div id="main" style={{marginTop:"50px"}}>
                    <div className="fof">
                      <h2>Select a project to view more</h2>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  {currentProject ? (
                    <div id="main" style={{ height: "100%" }}>
                      <div className="wrapper">
                        <div className="left">
                          <img
                            src="https://avatars.githubusercontent.com/u/5436359?s=80&v=4"
                            alt="project avatar"
                          />
                          <h3>{currentProject.projectName}</h3>
                          <h4>
                            By: {currentProject.createdBy} <br /> On:
                            {" " + currentProject.createdAt.substr(0, 10)}
                          </h4>
                          <p></p>
                        </div>
                        <div className="right">
                          <div className="info">
                            <h3>Information</h3>
                            <div className="info_data">
                              <div className="data">
                                <h4>ID</h4>
                                <p>{currentProject.projectID}</p>
                              </div>
                              <div className="data">
                                <h4>Project Lead</h4>
                                <p>{currentProject.projectLead}</p>
                              </div>
                            </div>
                            <div className="info_data">
                              <div className="data">
                                <h4>URL</h4>
                                <NavLink
                                  to={currentProject.URL}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {currentProject.URL}
                                </NavLink>
                              </div>
                              <div className="data">
                                <h4>Default Assignee</h4>
                                <p>{currentProject.defaultAssignee}</p>
                              </div>
                            </div>
                          </div>
                          <div className="projects">
                            <h3>Description</h3>
                            <div className="projects_data">
                              <p
                                style={{
                                  display: "inline-block",
                                  width: "100%",
                                  wordWrap: "break-word",
                                }}
                              >
                                {currentProject.projectDescription}
                              </p>
                            </div>
                          </div>
                          <div className="actions">
                            <ul style={{ listStyleType: "none" }}>
                              {cookies.get("admin") === "true" ? (
                                <li style={{ background: "#49B8F8" }}>
                                  <NavLink to={"/edit/" + project}>
                                    Edit <Icon name="pencil"></Icon>
                                  </NavLink>
                                </li>
                              ) : (
                                <></>
                              )}
                              <li style={{ background: "#FFDE18" }}>
                                <NavLink to={"/issues/" + project}>
                                  Issues <Icon name="bug"></Icon>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <Header>Project Members</Header>
                      <Table
                        sortable
                        celled
                        fixed
                        inverted
                        striped
                        selectable
                        style={{ width: "90%", marginBottom: "30px" }}
                      >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell
                              sorted={column === "username" ? direction : null}
                              onClick={() =>
                                dispatch({
                                  type: "CHANGE_SORT",
                                  column: "username",
                                })
                              }
                            >
                              Username
                            </Table.HeaderCell>
                            <Table.HeaderCell
                              sorted={column === "team" ? direction : null}
                              onClick={() =>
                                dispatch({
                                  type: "CHANGE_SORT",
                                  column: "team",
                                })
                              }
                            >
                              Team
                            </Table.HeaderCell>
                            <Table.HeaderCell
                              sorted={column === "role" ? direction : null}
                              onClick={() =>
                                dispatch({
                                  type: "CHANGE_SORT",
                                  column: "role",
                                })
                              }
                            >
                              Role
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {data ? (
                            data.map((ele, index) => (
                              <Table.Row key={index}>
                                <Table.Cell>{ele.username}</Table.Cell>
                                <Table.Cell>{ele.team}</Table.Cell>
                                <Table.Cell>{ele.role}</Table.Cell>
                              </Table.Row>
                            ))
                          ) : (
                            <></>
                          )}
                        </Table.Body>
                      </Table>
                    </div>
                  ) : (
                    <div id="main">
                      <div className="fof">
                        <h1>Oops..!</h1>
                        <h2>
                          Project <i style={{ color: "#0884E8" }}>{project}</i>{" "}
                          not found.
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Grid.Column>
          </>
        ) : (
          <div className="loading-body">
            <div className="loader" id="loader"></div>
            <span>Loading</span>
          </div>
        )}
      </Grid.Row>
      {open ? <CreateProject open={open} setOpen={setOpen} /> : <></>}
    </Grid>
  );
}
