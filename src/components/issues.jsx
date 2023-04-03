/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { CreateIssue } from "./modals";
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Menu,
  Pagination,
  Table,
} from "semantic-ui-react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import * as R from "ramda";
import _, { isArray } from "lodash";
import { sortDateAscend, sortDateDesc } from "../functions/filters";

export default function Issues() {
  const cookies = new Cookies();
  const project = useParams().projectID;
  const [currentProject, setCurrentProject] = useState(false);
  const [projects, setProjects] = useState(false);
  const [projectIssues, setProjectIssues] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeItem, setactiveItem] = useState("");
  const [ascend, setAscend] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
  const [users, setUsers] = useState(null);
  const [pages, setPages] = useState(null);
  const [activePage, setActivePage] = useState(0);

  const tableHead = [
    "IssueID",
    "Version",
    "Name",
    "Priority",
    "Status",
    "Current",
  ];
  const getProjects = () => {
    axios.get("/projects").then((resp) => {
      setProjects(resp.data);
      if (project) {
        let curr = R.find(R.propEq("projectID", project), resp.data);
        setActivePage(0);
        setCurrentProject(curr);
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
      setActivePage(0);
      setCurrentProject(R.find(R.propEq("projectID", project), projects));
    }
  }, [activeItem]);
  useEffect(() => {
    if (filter !== "All") {
      setFiltered(R.filter(R.propEq("status", filter), projectIssues));
      if (filter === "Approved") {
        setFiltered([
          ...R.filter(R.propEq("status", "Approved"), projectIssues),
          ...R.filter(R.propEq("status", "Assigned"), projectIssues),
        ]);
      }
    } else {
      setFiltered(projectIssues);
    }
  }, [open, projectIssues, filter]);
  const getIssues = () => {
    if (currentProject) {
      axios
        .get("/issues/" + activePage + "/" + currentProject.projectID)
        .then((resp) => {
          setProjectIssues(resp.data.issues);
          setPages(Math.ceil(resp.data.length / 10));
        });
    }
  };
  useEffect(getIssues, [currentProject, activePage]);
  useEffect(() => {});
  const sortFunction = () => {
    ascend
      ? setProjectIssues(sortDateAscend(projectIssues))
      : setProjectIssues(sortDateDesc(projectIssues));
    setAscend(!ascend);
  };
  const selectFilter = (e) => {
    setFilter(e.target.id);
  };
  const handleSearch = (e) => {
    let filteredData = projectIssues.filter((row) => {
      return Object.values(row).some((value) => {
        if (isNaN(value) || !isArray(value)) {
          return String(value)
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
    });
    setFiltered(filteredData);
  };
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
                    Raise Issue{" "}
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
                  if (value.trim() === "") navigate("/issues");
                  setActivePage(0);
                  setCurrentProject(
                    R.find(R.propEq("projectID", value), projects)
                  );
                  navigate("/issues/" + value);
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
                        to={"/issues/" + project.projectID}
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
                  {cookies.get("admin") === "true" ? (
                    <div id="main" style={{ marginTop: "50px" }}>
                      <div className="fof">
                        <h2>Select Project</h2>
                      </div>
                    </div>
                  ) : (
                    <div id="main" style={{ marginTop: "50px" }}>
                      <div className="fof">
                        <h2>Select a project to view more</h2>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {currentProject ? (
                    <div
                      id="main"
                      style={{ height: "100%", marginTop: "50px" }}
                    >
                      <div className="head-div">
                        <Header style={{ color: "#7632C4" }} size="large">
                          Issues in - {currentProject.projectName}
                        </Header>
                        <div>
                          <h3>Filters: </h3>
                          <label htmlFor="All" className="filter-label">
                            <input
                              type="radio"
                              name="filter"
                              id="All"
                              value="All"
                              onChange={selectFilter}
                              defaultChecked
                            />{" "}
                            All
                          </label>
                          <label htmlFor="Open" className="filter-label">
                            <input
                              type="radio"
                              name="filter"
                              id="Open"
                              value="Open"
                              onChange={selectFilter}
                            />{" "}
                            Open
                          </label>
                          <label htmlFor="Closed" className="filter-label">
                            <input
                              type="radio"
                              name="filter"
                              id="Closed"
                              value="Closed"
                              onChange={selectFilter}
                            />{" "}
                            Closed
                          </label>
                          <div className="search">
                            <input
                              type="text"
                              className="searchTerm"
                              id="searchBar"
                              placeholder="Search in this page.."
                              onChange={handleSearch}
                            />
                            <i className="fa fa-search searchButton"></i>
                          </div>
                        </div>
                      </div>
                      {filtered.length ? (
                        <Table
                          celled
                          striped
                          inverted
                          selectable
                          fixed
                          style={{ width: "95%" }}
                        >
                          <Table.Header>
                            <Table.Row>
                              {tableHead.map((ele, index) =>
                                ele !== "Date" ? (
                                  <Table.HeaderCell
                                    textAlign="center"
                                    key={index}
                                    colSpan={ele === "Assign To" ? "2" : "1"}
                                  >
                                    {ele}
                                  </Table.HeaderCell>
                                ) : (
                                  <Table.HeaderCell
                                    textAlign="center"
                                    key={index}
                                    id="datehead"
                                    style={{ cursor: "pointer" }}
                                    onClick={sortFunction}
                                  >
                                    {ele}
                                    <span
                                      id="sorticon"
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <i className="fa-solid fa-sort"></i>
                                    </span>
                                  </Table.HeaderCell>
                                )
                              )}
                            </Table.Row>
                          </Table.Header>

                          <Table.Body>
                            {filtered.map((issue, index) => {
                              return (
                                <Table.Row key={index}>
                                  <Table.Cell>
                                    <NavLink
                                      to={"/ticket/" + issue.ticketID}
                                      style={{
                                        textDecoration: "none",
                                        color: "#fff",
                                      }}
                                      onMouseOver={(e) => {
                                        e.target.style.color = "#066CC3";
                                      }}
                                      onMouseOut={(e) => {
                                        e.target.style.color = "#fff";
                                      }}
                                    >
                                      <Icon name="history"></Icon>
                                      {issue.ticketID}
                                    </NavLink>
                                  </Table.Cell>
                                  <Table.Cell>v{issue.version}</Table.Cell>
                                  <Table.Cell>{issue.issueName}</Table.Cell>
                                  <Table.Cell
                                    style={
                                      issue.priority === "Critical"
                                        ? {
                                            background: "#EC0A00",
                                            margin: "0",
                                            color: "white",
                                            fontWeight: "bold",
                                          }
                                        : issue.priority === "Moderate"
                                        ? {
                                            background: "#066CC3",
                                            margin: "0",
                                            color: "white",
                                            fontWeight: "bold",
                                          }
                                        : issue.priority === "Major"
                                        ? {
                                            background: "#F6C105",
                                            margin: "0",
                                            color: "white",
                                            fontWeight: "bold",
                                          }
                                        : {
                                            background: "#08B256",
                                            margin: "0",
                                            color: "white",
                                            fontWeight: "bold",
                                          }
                                    }
                                  >
                                    {issue.priority}
                                  </Table.Cell>
                                  <Table.Cell
                                    textAlign="center"
                                    style={
                                      issue.status === "Closed"
                                        ? {
                                            background: "#EC0A00",
                                            margin: "0",
                                            color: "white",
                                            fontWeight: "bold",
                                          }
                                        : {
                                            background: "#066CC3",
                                            margin: "0",
                                            color: "white",
                                            fontWeight: "bold",
                                          }
                                    }
                                  >
                                    {issue.status}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {issue.currentAssignee}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                      ) : (
                        <div>
                          {filtered === false ? (
                            <div
                              className="loading-body"
                              style={{
                                height: "100%",
                                width: "100%",
                                marginBlock: "50px",
                              }}
                            >
                              <div className="loader" id="loader"></div>
                              <span>Loading</span>
                            </div>
                          ) : (
                            <h1
                              style={{
                                fontSize: "25px",
                                color: "#888",
                                margin: "20px 0px",
                              }}
                            >
                              Nothing to show.....
                            </h1>
                          )}
                        </div>
                      )}
                      <Pagination
                        activePage={activePage + 1}
                        style={{ marginBottom: "20px" }}
                        onPageChange={(e) => {
                          document.getElementById("searchBar").value = "";
                          setActivePage(
                            (activePage) =>
                              (activePage =
                                parseInt(e.target.getAttribute("value")) - 1)
                          );
                          setFilter(
                            document.querySelector(
                              'input[name="filter"]:checked'
                            ).value
                          );
                        }}
                        totalPages={pages}
                      />
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
      {open ? (
        <CreateIssue open={open} setOpen={setOpen} projects={projects} />
      ) : (
        <></>
      )}
    </Grid>
  );
}
