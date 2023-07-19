import { Fragment, useState, useEffect } from "react";
import uuid from "react-uuid";
import Nestable from "react-nestable";
import { Grid, Tooltip, IconButton, Button, Box } from "@mui/material";
import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  RadioInput,
  TextArea,
  TextFieldInput,
} from "../createform/FormBuilder/elements";
import { formEl } from "../createform/FormBuilder/constants";
import Header from "../createform/FormBuilder/Header";
import { selectUser } from "../../../redux/features/userSlice";

const EditFormPage = () => {
  const { formId } = useParams();
  const initVal = formEl[0]?.value;

  //State
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const items = data;

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/getPoll/${formId}`
        );

        // Log response data to see its structure
        console.log("Response data:", response.data.title);

        // Set the state
        setTitle(response.data.title);
        setDescription(response.data.description);
        // Set other state variables if you have them

        const questionsResponse = await axios.get(
          `${import.meta.env.VITE_API_BACKEND}/getQuestions/${formId}`
        );
        setData(questionsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFormData();
  }, [formId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userId = user.id;

      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND}/updatePoll/${formId}`,
        {
          start_date: startDate,
          end_date: endDate,
          title,
          description,
          userId,
        }
      );
      await Promise.all(
        data.map((question) =>
          axios.put(
            `${import.meta.env.VITE_API_BACKEND}/updateQuestion/${question.id}`,
            {
              question_text: question.value,
              answers: question.options,
            }
          )
        )
      );

      navigate("/forms");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
            description={
              description ? <h3>{description}</h3> : <h3>Loading...</h3>
            }
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
            transition: "opacity 0.36s ease",
            "&:hover": {
              backgroundColor: "#BA68C8",
            },
          }}
          onClick={handleSubmit}
        >
          Update Form
        </Button>
      </Box>
    </Fragment>
  );
};

export default EditFormPage;
