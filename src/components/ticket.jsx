import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddAssignee, ImageModal } from "./modals";
import { NavLink } from "react-router-dom";
import { Button, Card, Comment, Feed, Header, Icon } from "semantic-ui-react";
import { convetTime } from "../functions/filters";
import Cookies from "universal-cookie";

export default function Ticket() {
  const bugPriorities = ["Low", "Moderate", "Major", "Critical"];
  const cookies = new Cookies();
  const [ticket, setTicket] = useState(false);
  const [currentProject, setCurrentProject] = useState(false);
  const [history, setHistory] = useState(false);

  const [open, setOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(3);
  const [comments, setComments] = useState(false);
  const [action, setAction] = useState(false);
  const [modalVisibility, setVisibility] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const ticketID = useParams().ticketID;

  useEffect(() => {
    if (!open)
      axios.get("/issueTicket/" + ticketID).then((resp) => {
        setTicket(resp.data.ticket);
        setHistory(resp.data.history);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const handleAction = (e) => {
    setSelectedImage(e.target.src);
    setVisibility(true);
  };
  useEffect(() => {
    if (ticket) {
      axios.get("/projects/" + ticket.projectID).then((resp) => {
        setCurrentProject(resp.data[0]);
      });
      axios
        .get("/comments/" + commentCount + "/" + ticket.ticketID)
        .then((resp) => {
          setComments(resp.data);
        });
    }
  }, [ticket]);

  const handelComment = async (ticketID) => {
    let comment = document.getElementById("comment-" + ticketID);
    if (comment === "") return;
    await axios.post("/comments", {
      ticketID: ticketID,
      comment: comment.value,
    });
    setAction(!action);
    comment.value = "";
  };
  useEffect(() => {
    axios.get("/issueTicket/" + ticketID).then((resp) => {
      setTicket(resp.data.ticket);
      setHistory(resp.data.history);
    });
  }, [action]);
  useEffect(() => {}, [currentProject, history]);
  const changePriority = (e) => {
    let temp = {};
    temp["ticketID"] = ticket.ticketID;
    temp["priority"] = e.target.value;
    axios
      .post("/updateIssuePriority", temp, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        if (resp) setAction(!action);
      });
  };
  useEffect(() => {}, [comments]);
  useEffect(() => {
    if (ticket) {
      axios
        .get("/comments/" + commentCount + "/" + ticket.ticketID)
        .then((resp) => {
          setComments(resp.data);
        });
    }
  }, [commentCount]);
  return (
    <>
      {ticket ? (
        <div className="ticket-thread" style={{ height: "fit-content" }}>
          <div className="wrapper" style={{ width: "70%" }}>
            <div className="right" style={{ width: "100%" }}>
              <div className="info">
                <h3>
                  {ticket.issueName} @ {ticket.createdAt.substr(0, 10)}
                </h3>
                <div className="info_data">
                  <div className="data">
                    <h4>Ticket ID</h4>
                    <p>{ticket.ticketID}</p>
                  </div>
                  <div className="data">
                    <h4>Reported By</h4>
                    <p>{ticket.reportedBy}</p>
                  </div>
                  <div className="data">
                    <h4>Priotity</h4>
                    <select
                      name="priority"
                      style={
                        ticket.priority === "Critical"
                          ? {
                              background: "#EC0A00",
                              margin: "0",
                              color: "white",
                              fontWeight: "bold",
                            }
                          : ticket.priority === "Moderate"
                          ? {
                              background: "#066CC3",
                              margin: "0",
                              color: "white",
                              fontWeight: "bold",
                            }
                          : ticket.priority === "Major"
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
                      defaultValue={ticket.priority}
                      onChange={changePriority}
                    >
                      {bugPriorities.map((ele, index) => {
                        return (
                          <option
                            value={ele}
                            key={index}
                            style={{ background: "#fff", color: "#000" }}
                          >
                            {ele}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="info_data">
                  <div className="data">
                    <h4>Current Status</h4>
                    {ticket.status}
                  </div>
                  <div className="data">
                    <h4>URL</h4>
                    <NavLink to={ticket.URL} target="_blank" rel="noreferrer">
                      {ticket.URL}
                    </NavLink>
                  </div>
                  <div className="data">
                    <h4>Current Assignee</h4>
                    <p>{ticket.currentAssignee}</p>
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
                    {ticket.issueDescription}
                  </p>
                </div>
              </div>
              {ticket.issueImages.length ? (
                <>
                  <div className="projects">
                    <h3>Images</h3>
                    <div className="projects_data">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          width: "50%",
                        }}
                      >
                        {ticket.issueImages.map((img, index) => {
                          return (
                            <img
                              src={img}
                              alt={"Bug image " + index + 1}
                              className="modalImage"
                              style={{
                                width: "60px",
                                height: "60px",
                                cursor: "pointer",
                              }}
                              onClick={handleAction}
                              key={index}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="actions">
                <h4>Actions</h4>
                <ul style={{ listStyleType: "none" }}>
                  {ticket.status === "Closed" ? (
                    <li style={{ background: "#EFC707", cursor: "pointer" }}>
                      Reopen
                    </li>
                  ) : (
                    <li style={{ background: "#ED7F7E", cursor: "pointer" }}>
                      Close
                    </li>
                  )}

                  <li style={{ background: "#EB0800", cursor: "pointer" }}>
                    Delete <Icon name="ticket"></Icon>
                  </li>

                  {currentProject ? (
                    <>
                      {cookies.get("username") === currentProject.createdBy ||
                      cookies.get("username") === currentProject.projectLead ||
                      cookies.get("username") === ticket.reportedBy ? (
                        <li
                          style={{ background: "#2185D0", cursor: "pointer" }}
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          Assign To <Icon name="user outline"></Icon>
                        </li>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {open ? (
            <AddAssignee
              open={open}
              setOpen={setOpen}
              project={currentProject}
              ticket={ticket}
            />
          ) : (
            <></>
          )}
          <div className={modalVisibility ? "overlay active" : "overlay"}>
            {selectedImage == null ? (
              <></>
            ) : (
              <ImageModal
                visibility={modalVisibility}
                setVisibility={setVisibility}
                setAction={setAction}
                image={selectedImage}
                action={action}
              />
            )}
          </div>
          <Card style={{ width: "30%" }}>
            <Card.Content>
              <Card.Header>
                Ticket Activity <Icon name="history"></Icon>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              {history ? (
                history.length ? (
                  <>
                    {history.map((ele, index) => {
                      return (
                        <Feed key={index}>
                          <Feed.Event>
                            <Feed.Label image="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png" />
                            <Feed.Content>
                              <Feed.Date>
                                {ele.createdAt.substr(0, 10) +
                                  " @ " +
                                  convetTime(ele.createdAt.substr(11, 8))}
                              </Feed.Date>
                              <br />
                              <Feed.Date content="" />
                              <Feed.Summary>
                                Assigned to : {ele.assignedTo}
                              </Feed.Summary>
                              <Feed.Extra>{ele.comments}</Feed.Extra>
                            </Feed.Content>
                          </Feed.Event>
                        </Feed>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <Feed>
                      <Feed.Event>
                        <Feed.Content>
                          <Feed.Summary>No Activity</Feed.Summary>
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                  </>
                )
              ) : (
                <></>
              )}
            </Card.Content>
          </Card>
          <div
            className="ticket-body"
            style={{ minHeight: "auto!important" }}
          >
            <fieldset>
              <legend>Comments</legend>
              <div className="commentBox">
                <input
                  placeholder="Add Comment"
                  type="text"
                  id={"comment-" + ticket.ticketID}
                  autoComplete="off"
                />
                <span
                  style={{
                    padding: "5px 10px",
                    fontSize: "16px",
                    background: "#0884E8",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "0px 3px 3px 0px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handelComment(ticket.ticketID);
                  }}
                >
                  <i
                    className="fa fa-paper-plane"
                    style={{ color: "#fff" }}
                  ></i>
                </span>
              </div>
              <br />
              <br />
              {comments ? (
                <>
                  {comments.comments.length ? (
                    <>
                      <Comment.Group className="main" style={{ width: "90%" }}>
                        <Header>Comments</Header>
                        {comments.comments.map((comment, index) => {
                          return (
                            <Comment>
                              <Comment.Avatar src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png" />
                              <Comment.Content>
                                <Comment.Author>
                                  {comment.commentedBy}
                                </Comment.Author>
                                <Comment.Metadata>
                                  <div>
                                    {comment.createdAt.substr(0, 10) +
                                      " @ " +
                                      comment.createdAt.substr(11, 8)}
                                  </div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.comment}</Comment.Text>
                              </Comment.Content>
                            </Comment>
                          );
                        })}
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            style={{ background: "#0884E8", color: "#fff" }}
                            onClick={() => {
                              setCommentCount(commentCount + 3);
                            }}
                          >
                            Show More
                          </Button>
                        </div>
                      </Comment.Group>
                    </>
                  ) : (
                    <div className="main">
                      <h4>No Comments to show</h4>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="main">
                    <h4>No Comments to show</h4>
                  </div>
                </>
              )}
            </fieldset>
          </div>
        </div>
      ) : (
        <div className="loading-body">
          <div className="loader" id="loader"></div>
          <span>Loading</span>
        </div>
      )}
    </>
  );
}
