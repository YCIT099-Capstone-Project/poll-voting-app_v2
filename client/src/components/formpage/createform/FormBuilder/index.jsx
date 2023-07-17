import { Fragment, useState, useEffect } from "react";
import uuid from "react-uuid";
import Nestable from "react-nestable";
//Material UI Components
import { Grid, Tooltip, IconButton, Button, Box } from "@mui/material";
//Icons
import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
//Form Elements
import {
  TextFieldInput,
  TextArea,
  NumberInput,
  RadioInput,
  DateInput,
  TimeInput,
} from "./elements";
import Layout from "./elements/layout";
import { formEl } from "./constants.js";
//Components
import Header from "./Header";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const FormBuilder = () => {
  const initVal = formEl[0]?.value;

  //State
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState("text");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const items = data;
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userId = user.id;
      const payload = {
        start_date: startDate,
        end_date: endDate,
        title,
        description,
        userId,
        questions: data,
      };
      const response = await axios.post(
        "http://localhost:4000/createsurvey",
        payload
      );
      navigate("/forms");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Function to add new element
  const addElement = () => {
    const data = {
      id: uuid(),
      value: "",
      type: formData,
      required: false,
    };
    setData((prevState) => [...prevState, data]);
    setFormData(initVal);
  };

  //Function to delete element
  const deleteEl = (id) => {
    setData((prevState) => prevState.filter((val) => val.id !== id));
  };

  //Function to add element at specific pos and return arr
  const addAfter = (elArray, index, newEl) => {
    return [...elArray.slice(0, index + 1), newEl, ...elArray.slice(index + 1)];
  };

  //Function to duplicate element
  const duplicateElement = (elId, elType) => {
    let elIdx = data.findIndex((el) => el.id === elId);
    let newEl = {
      id: uuid(),
      value: "",
      type: elType,
      required: false,
    };
    let newArr = addAfter(data, elIdx, newEl);
    setData(newArr);
  };

  //Function to handle sorting of elements
  const handleOnChangeSort = ({ items }) => {
    setData(items);
  };

  //Function to Handle Input Values
  const handleValue = (id, e) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, value: e.target.value };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Required
  const handleRequired = (id) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, required: !el.required };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Element Type
  const handleElType = (id, type) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, type: type };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Options
  const addOption = (id, newOption) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        const objVal = "options" in el ? el?.options : [];
        return { ...el, options: [...objVal, newOption] };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Date
  const handleDate = (id, dateVal) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, date: dateVal };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Handle Time
  const handleTime = (id, dateVal) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, time: dateVal };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Change Option Values
  const handleOptionValues = (elId, optionId, optionVal) => {
    let newArr = data.map((el) => {
      if (el.id === elId) {
        el?.options &&
          el?.options.map((opt) => {
            if (opt.id === optionId) {
              opt.value = optionVal;
            }
          });
        return el;
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Function to Delete Optin
  const deleteOption = (elId, optionId) => {
    let newArr = data.map((el) => {
      if (el.id === elId) {
        let newOptions =
          el?.options && el?.options.filter((opt) => opt.id !== optionId);
        return { ...el, options: newOptions };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  //Render items
  const renderElements = ({ item }) => {
    switch (item.type) {
      case "text":
        return (
          <TextFieldInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "textarea":
        return (
          <TextArea
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "radio":
        return (
          <RadioInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            addOption={addOption}
            handleOptionValues={handleOptionValues}
            deleteOption={deleteOption}
            duplicateElement={duplicateElement}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  console.log(data);

  return (
    <Fragment>
      <Grid container spacing={1} direction="row" justifyContent="center">
        <Grid item md={6}>
          <Header
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          <Nestable
            items={items}
            renderItem={renderElements}
            maxDepth={1}
            onChange={handleOnChangeSort}
          />
        </Grid>
        <Grid item md={1}>
          <Tooltip title="Add Element" aria-label="add-element">
            <IconButton
              aria-label="add-element"
              onClick={addElement}
              sx={{ position: "sticky", top: 30 }}
            >
              <AddCircleOutlineIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Box sx={{ width: "fit-content", margin: "0 auto" }}>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#9C27B0",
            color: "white",
            fontSize: "20px",
            padding: "10px 60px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "opacity 0.36s ease", // Add transition property for opacity
            "&:hover": {
              backgroundColor: "#BA68C8",
            },
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Fragment>
  );
};
export default FormBuilder;
