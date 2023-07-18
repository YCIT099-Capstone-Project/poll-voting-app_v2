import React, { useState, useEffect } from "react";
import { ArrowDropDown, Storage, FolderOpen } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import moment from "moment";
import "./MainFormBody.css";
import { selectUser } from "../../../redux/features/userSlice";
import { Link } from "react-router-dom";

const MainFormBody = () => {
  const [polls, setPolls] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenu = (event, poll) => {
    setSelectedPoll(poll);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPoll(null);
  };

  const user = useSelector(selectUser);

  useEffect(() => {
    if (user && user.id) {
      fetch(`${import.meta.env.VITE_API_BACKEND}/getPolls/${user.id}`)
        .then((response) => response.json())
        .then((data) => setPolls(data))
        .catch((err) => console.log(err));
    }
  }, [user]);

  const deletePoll = (pollId) => {
    fetch(`${import.meta.env.VITE_API_BACKEND}/deletePoll/${pollId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message);
          // Remove the poll from the list of polls
          setPolls((prevPolls) =>
            prevPolls.filter((poll) => poll.id !== pollId)
          );
        } else if (data.error) {
          console.error(data.error);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleCopyLink = (pollId) => {
    const link = `${import.meta.env.VITE_API_FRONTEND}/${pollId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="main_body">
      <div className="mainbody_top">
        <div className="mainbody_top_left">Recent Forms</div>
        <div className="mainbody_top_right">
          <div className="mainbody_top_center">
            Owned by Anyone <ArrowDropDown />
          </div>
          <IconButton>
            <Storage />
          </IconButton>
          <IconButton>
            <FolderOpen />
          </IconButton>
        </div>
      </div>
      <div className="mainbody_docs">
        {polls.map((poll) => (
          <div className="doc_card" key={poll.id}>
            <img
              src="https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2019/01/getting-google-form-link-by-clicking-send-button.webp"
              alt=""
              className="doc_img"
            />
            <div className="doc_card_content">
              {poll.title && <h5>{poll.title}</h5>}
              <div className="doc_content">
                {poll.start_date && (
                  <div className="content_left">
                    <Storage
                      style={{
                        color: "white",
                        fontSize: "12px",
                        backgroundColor: "#6e2594",
                        padding: "3px",
                        marginRight: "3px",
                        borderRadius: "2px",
                      }}
                    />
                    created {moment(poll.start_date).format("MMM D, YYYY")}
                  </div>
                )}
                <IconButton onClick={(event) => handleMenu(event, poll)}>
                  <MoreVertIcon style={{ fontSize: "12px", color: "gray" }} />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open && selectedPoll?.id === poll.id}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to={`/forms/${poll.id}/responses`}
                    onClick={handleClose}
                  >
                    View Responses
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      deletePoll(poll.id);
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <div
                      className={
                        copySuccess ? "copy-link-btn success" : "copy-link-btn"
                      }
                      onClick={() => handleCopyLink(poll.id)}
                    >
                      {copySuccess ? "Link Copied!" : "Copy Link"}
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainFormBody;
