import { useEffect, useState } from "react";
import axios from "axios";
import * as R from "ramda";
import "../Styles/style.css";
import { useDispatch } from "react-redux";
import { setSelected } from "../reducers/globalStates";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Button,
  Dropdown,
  Icon,
  Input,
  Label,
  Modal,
  TextArea,
} from "semantic-ui-react";
import Cookies from "universal-cookie";

export const CreateIssue = ({ open, setOpen, projects }) => {
  const [currentProject, setCurrentProject] = useState(false);
  const [issueName, setIssueName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [comments, setComments] = useState("");
  const [images, setImages] = useState({});
  const [fileCount, setFileCount] = useState(0);
  const [defaultAssignee, setDefault] = useState("");
  const [issueUrl, setIssueUrl] = useState("");
  const [issueVersion, setIssueVersion] = useState("");
  //Handle Images
  const onFileChange = (e) => {
    if (fileCount < 2) {
      e.target.files[0]
        ? setFileCount((fileCount) => fileCount + 1)
        : setFileCount(fileCount);
      let tempImages = { ...images };
      tempImages[fileCount] = e.target.files[0];
      setImages({ ...tempImages });
    }
    e.target.value = "";
  };
  const deleteImage = (index) => {
    let temp = { ...images };
    if (Object.keys(temp).length === 1) {
      setImages({});
      setFileCount(0);
    } else {
      delete temp[index];
      setImages(temp);
      setFileCount((fileCount) => fileCount - 1);
    }
  };
  //Report Issue API call
  const createNewIssue = async () => {
    if (issueName === "" || issueDescription === "" || issueUrl === "")
      return false;
    let data = new FormData();
    let item = {
      projectID: currentProject.projectID,
      issueName: issueName,
      issueDescription: issueDescription,
      comments: comments,
      version: issueVersion,
      currentAssignee: defaultAssignee,
      URL: issueUrl,
      projectMembers: defaultAssignee,
    };
    for (var key in item) {
      data.append(key, item[key]);
    }
    let keys = Object.keys(images);
    keys.map((key) => {
      data.append("images", images[key]);
      return 0;
    });
    await axios
      .post("/createIssue", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setOpen(false);
      });
  };
  const checkIssueName = (e) => {
    const errSpan = document.getElementById("proNameCheck");
    if (e.target.value.trim() === "") {
      e.target.value = "";
      errSpan.style.color = "red";
      errSpan.innerHTML = "<-- Project Name Cannot Be Empty";
      return;
    }
    axios.get("/checkIssueName/" + e.target.value).then((resp) => {
      if (resp.data) {
        setIssueName(e.target.value);
        errSpan.style.color = "green";
        errSpan.innerHTML = "Good to go...";
        return true;
      }
      setIssueName("");
      errSpan.style.color = "red";
      errSpan.innerHTML = "<-- Name Taken";
      return false;
    });
  };
  useEffect(() => {}, [currentProject]);
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Header>
        Create Issue <span id="subERR" style={{ marginLeft: "50px" }}></span>
      </Modal.Header>
      <Modal.Content scrolling style={{ minHeight: "300px" }}>
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
            if (value.trim() === "") setCurrentProject(false);
            const curr = R.find(R.propEq("projectID", value), projects);
            setCurrentProject(curr);
            setDefault(curr.defaultAssignee);
          }}
          placeholder="Search Project..."
          noResultsMessage="Try another search."
        />
        {currentProject ? (
          <>
            <br />
            <br />
            <Input
              label="Issue Name"
              onBlur={checkIssueName}
              style={{ width: "50%" }}
            />
            <span id="proNameCheck" style={{ marginLeft: "10px" }}></span>
            <br />
            <br />
            <Input
              label="Version"
              placeholder="1.0.0"
              onBlur={(e) => {
                setIssueVersion(e.target.value);
              }}
              style={{ width: "20%" }}
            />

            <br />
            <br />
            <Input
              style={{ width: "50%" }}
              label="Issue Url"
              onChange={(e, { value }) => {
                const errSpan = document.getElementById("urlCheck");
                if (value.trim() === "") {
                  e.target.value = "";
                  errSpan.style.color = "red";
                  errSpan.innerHTML = "Url is required";
                  return;
                }
                try {
                  new URL(value);
                  errSpan.innerHTML = "";
                  setIssueUrl(value);
                } catch (err) {
                  errSpan.style.color = "red";
                  errSpan.innerHTML = "Enter a valid Url";
                }
              }}
            />
            <span id="urlCheck" style={{ marginLeft: "10px" }}></span>
            <br />
            <div>
              <br />
              <Label>
                Issue Description <span style={{ color: "red" }}>*</span>
              </Label>
              <TextArea
                placeholder="Enter Issue Description..."
                style={{ minHeight: 80, width: "100%" }}
                onChange={(e, { value }) => {
                  // setMembers(value);
                  const errSpan = document.getElementById("descText");
                  if (value.trim() === "") {
                    e.target.value = "";
                    errSpan.style.color = "red";
                    errSpan.innerHTML = "Description Cannot Be Empty";
                    return;
                  }
                  errSpan.innerHTML = "";
                  setIssueDescription(value);
                }}
              />
              <span id="descText"></span>
            </div>
            <br />
            <br />
            <Label>Images</Label>
            <input
              type="file"
              name="images"
              id="images"
              accept="image/*"
              onChange={onFileChange}
            />
            <div className="images">
              {Object.keys(images).map((image, index) => {
                return (
                  <div key={index} className="image">
                    <span>{images[image].name.substr(0, 8)}</span>
                    <i
                      style={{ marginLeft: "10px" }}
                      className="fa-regular fa-circle-xmark"
                      onClick={() => deleteImage(index)}
                    ></i>
                  </div>
                );
              })}
            </div>
            <div>
              <br />
              <Label>Issue Comments</Label>
              <TextArea
                placeholder="Enter your comments..."
                style={{ minHeight: 30, width: "100%" }}
                onChange={(e, { value }) => {
                  // setMembers(value);
                  if (value.trim() === "") {
                    e.target.value = "";
                    return;
                  }
                  setComments(value);
                }}
              />
            </div>
            <div>
              <br />
              <Label>Assignee</Label>
              <Dropdown
                placeholder={defaultAssignee}
                search
                selection
                defaultValue={defaultAssignee}
                defaultSelectedLabel={defaultAssignee}
                onChange={(e, { value }) => {
                  setDefault(value);
                }}
                options={[
                  { key: "", text: "Select Assignee", value: "" },
                  ...currentProject.projectMembers.map((user) => {
                    return { key: user, text: user, value: user };
                  }),
                ]}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={async () => {
            if (await createNewIssue()) {
              setOpen(false);
            } else {
              const errSpan = document.getElementById("subERR");
              errSpan.style.color = "red";
              errSpan.innerHTML = "Incomplete data provided...! <br/>";
              return;
            }
          }}
          color="green"
        >
          Create <Icon name="chevron right" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export const CreateProject = ({ open, setOpen }) => {
  const [users, setUsers] = useState([]);
  const cookies = new Cookies();
  //Form Values
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLead, setProjectLead] = useState(cookies.get("username"));
  const [defaultAssignee, setDefault] = useState("PL");
  const [members, setMembers] = useState(["all"]);
  const [projectUrl, setProjectUrl] = useState("");
  const checkProjectName = (e) => {
    const errSpan = document.getElementById("proNameCheck");
    if (e.target.value.trim() === "") {
      e.target.value = "";
      errSpan.style.color = "red";
      errSpan.innerHTML = "<-- Project Name Cannot Be Empty";
      return;
    }
    axios.get("/checkProjectName/" + e.target.value).then((resp) => {
      if (resp.data) {
        setProjectName(e.target.value);
        errSpan.style.color = "green";
        errSpan.innerHTML = "Good to go...";
        return true;
      }
      setProjectName("");
      errSpan.style.color = "red";
      errSpan.innerHTML = "<-- Name Taken";
      return false;
    });
  };
  useEffect(() => {
    if (users.length) return;
    axios.get("https://backflipt-accounts.onrender.com/users").then((resp) => {
      let tempUsers = [];
      resp.data.map((user, index) => {
        tempUsers.push({
          text: user.username,
          value: user.username,
          key: index,
        });
        return false;
      });
      setUsers([...tempUsers]);
    });
  });
  const createNewProject = async () => {
    if (projectName === "" || projectDescription === "" || projectUrl === "")
      return false;
    await axios
      .post("/createProject", {
        projectName: projectName,
        projectDescription: projectDescription,
        projectLead: projectLead,
        defaultAssignee: defaultAssignee,
        URL: projectUrl,
        projectMembers: members,
      })
      .then((resp) => {
        setOpen(false);
      });
  };
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Header>
        New Project <span id="subERR" style={{ marginLeft: "50px" }}></span>
      </Modal.Header>
      <Modal.Content scrolling>
        <Input
          label="Project Name"
          onBlur={checkProjectName}
          style={{ width: "50%" }}
        />
        <span id="proNameCheck" style={{ marginLeft: "10px" }}></span>
        <br />
        <br />
        <Input
          style={{ width: "50%" }}
          label="Project Url"
          onChange={(e, { value }) => {
            const errSpan = document.getElementById("urlCheck");
            if (value.trim() === "") {
              e.target.value = "";
              errSpan.style.color = "red";
              errSpan.innerHTML = "Url is required";
              return;
            }
            try {
              new URL(value);
              errSpan.innerHTML = "";
              setProjectUrl(value);
            } catch (err) {
              errSpan.style.color = "red";
              errSpan.innerHTML = "Enter a valid Url";
            }
          }}
        />
        <span id="urlCheck" style={{ marginLeft: "10px" }}></span>
        <br />
        <div>
          <br />
          <Label>
            Project Description <span style={{ color: "red" }}>*</span>
          </Label>
          <TextArea
            placeholder="Enter Project Description..."
            style={{ minHeight: 80, width: "100%" }}
            onChange={(e, { value }) => {
              // setMembers(value);
              const errSpan = document.getElementById("descText");
              if (value.trim() === "") {
                e.target.value = "";
                errSpan.style.color = "red";
                errSpan.innerHTML = "Description Cannot Be Empty";
                return;
              }
              errSpan.innerHTML = "";
              setProjectDescription(value);
            }}
          />
          <span id="descText"></span>
        </div>
        <div>
          <br />
          <Label>
            Project Lead <span style={{ color: "red" }}>*</span>
          </Label>
          <Dropdown
            placeholder={cookies.get("username")}
            search
            selection
            options={users}
            defaultValue={cookies.get("username")}
            onChange={(e, { value }) => {
              setProjectLead(value);
            }}
          />
        </div>
        <div>
          <br />
          <Label>
            Members <span style={{ color: "red" }}>*</span>
          </Label>
          <Dropdown
            placeholder="Select Team Members"
            fluid
            multiple
            search
            selection
            defaultValue={"All"}
            style={{ height: "fit-content" }}
            onChange={(e, { value }) => {
              if ("all" in value) {
                return;
              }
              setMembers(value);
            }}
            options={[{ key: "all", text: "All", value: "all" }, ...users]}
          />
        </div>
        <div>
          <br />
          <Label>Default Assignee</Label>
          <Dropdown
            placeholder="Project Lead"
            search
            selection
            defaultSelectedLabel={"Project Lead"}
            onChange={(e, { value }) => {
              setDefault(value);
            }}
            options={[
              { key: "PL", text: "Project Lead", value: "PL" },
              ...users,
            ]}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={async () => {
            if (await createNewProject()) {
              setOpen(false);
            } else {
              const errSpan = document.getElementById("subERR");
              errSpan.style.color = "red";
              errSpan.innerHTML = "Incomplete data provided...! <br/>";
              return;
            }
          }}
          color="green"
        >
          Create <Icon name="chevron right" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export const AddAssignee = ({ open, setOpen, project, ticket }) => {
  const cookies = new Cookies();
  //Form Values
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (users.length) return;
    axios.get("https://backflipt-accounts.onrender.com/users").then((resp) => {
      let tempUsers = [];
      resp.data.map((user, index) => {
        tempUsers.push({
          text: user.username,
          value: user.username,
          key: index,
        });
        return false;
      });
      setUsers([...tempUsers]);
    });
  });
  const [assignee, setAssignee] = useState("");
  const [comment, setComment] = useState("");

  const assignTicket = async () => {
    if (assignee === "") return false;
    axios
      .post("/assignTicket", {
        ticketID: ticket.ticketID,
        comments: comment,
        assignedTo: assignee,
      })
      .then((resp) => {
        if (resp.data) setOpen(false);
      });
  };
  useEffect(() => {});

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Header>
        Assign To <span id="subERR" style={{ marginLeft: "50px" }}></span>
      </Modal.Header>
      <Modal.Content scrolling style={{ minHeight: "300px" }}>
        <div>
          <br />
          <Label>Assignee</Label>
          <Dropdown
            placeholder={"Select Assignee"}
            search
            selection
            scrolling
            defaultValue=""
            defaultSelectedLabel={""}
            onChange={(e, { value }) => {
              setAssignee(value);
            }}
            options={
              project.projectMembers[0] === "all"
                ? users
                : [
                    { key: "", text: "Select Assignee", value: "" },
                    ...project.projectMembers.map((user) => {
                      return { key: user, text: user, value: user };
                    }),
                  ]
            }
          />
        </div>
        <div>
          <br />
          <Label>Add Comments</Label>
          <TextArea
            placeholder="Enter your comments..."
            style={{ minHeight: 30, width: "100%" }}
            onChange={(e, { value }) => {
              // setMembers(value);
              if (value.trim() === "") {
                e.target.value = "";
                return;
              }
              setComment(value);
            }}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={async () => {
            if (await assignTicket()) {
              setOpen(false);
            } else {
              const errSpan = document.getElementById("subERR");
              errSpan.style.color = "red";
              errSpan.innerHTML = "Incomplete data provided...! <br/>";
              return;
            }
          }}
          color="green"
        >
          Assign <Icon name="chevron right" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const functionalities = (bug, handleApproval, handleReject) => {
  if (bug.status === "Fixed" || bug.status === "Assigned") return <></>;
  else if (bug.status === "Approved")
    return (
      <button onClick={handleReject} style={{ background: "#DC3545" }}>
        Reject
      </button>
    );
  else if (bug.status === "Rejected")
    return (
      <button onClick={handleApproval} style={{ background: "#218838" }}>
        Approve
      </button>
    );
  else
    return (
      <>
        <button onClick={handleApproval} style={{ background: "#218838" }}>
          Approve
        </button>
        <button onClick={handleReject} style={{ background: "#DC3545" }}>
          Reject
        </button>
      </>
    );
};

export const ImageModal = ({
  setAction,
  action,
  setVisibility,
  visibility,
  image,
}) => {
  const handleHide = (e) => {
    setVisibility(!visibility);
  };
  return (
    <div
      className="more-details"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "none",
        border: "none",
        boxShadow: "none",
      }}
    >
      <span className="close-button" onClick={handleHide}>
        <i className="fa-regular fa-circle-xmark"></i>
      </span>
      <img src={image} alt="bug" style={{ width: "500px", height: "500px" }} />
    </div>
  );
};
