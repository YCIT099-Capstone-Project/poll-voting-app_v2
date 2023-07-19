import { IconButton } from "@mui/material";
import React, { Fragment, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import { List, ListItem } from "@mui/material";
import { Sidebarlogo } from "../../assets/img/";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
const TestDrawer = () => {
  const [state, setState] = useState({
    left: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div>
      <List
        style={{
          width: "250px",
        }}
        role="presentation"
      >
        <Divider />
        <ListItem>
          <img
            src={Sidebarlogo}
            alt="sidebar logo"
            style={{
              width: "90px",
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <Link to={"./"}>HOME</Link>
        </ListItem>

        <Divider />
        <ListItem>
          <a href="../polls/token" target="_blank">
            Survey Token Page
          </a>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
  return (
    <div>
      <Fragment>
        <IconButton onClick={toggleDrawer("left", true)} anchor={"left"}>
          <MenuIcon />
        </IconButton>
        <Drawer open={state["left"]} onClose={toggleDrawer("left", false)}>
          {list("left")}
        </Drawer>
      </Fragment>
    </div>
  );
};

export default TestDrawer;
