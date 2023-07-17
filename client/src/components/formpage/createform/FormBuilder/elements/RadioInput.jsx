import { Fragment } from "react";
import uuid from "react-uuid";
//MUI Components
import {
  TextField,
  Box,
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
//Icons
import {
  DragIndicator as DragIndicatorIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";

//Form Elements
import { formEl } from "../constants";

const RadioInput = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  addOption,
  handleOptionValues,
  deleteOption,
  duplicateElement,
}) => {
  //Create new option
  const createNewOption = (id) => {
    console.log(id, typeof id, "this is id");
    const data = {
      id: uuid(),
      value: "",
    };
    addOption(id, data);
  };

  return (
    <Fragment>
      <Paper elevation={1}>
        <Box sx={{ textAlign: "center" }}>
          <DragIndicatorIcon
            sx={{ transform: "rotate(-90deg)", cursor: "all-scroll" }}
          />
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <TextField
                defaultValue={item.value}
                variant="outlined"
                onBlur={(e) => handleValue(item.id, e)}
                fullWidth
                required={item.required}
                placeholder="Radio Label"
                sx={{ mb: 2 }}
              />
              {item.options &&
                item.options.length > 0 &&
                item.options.map((opt, key) => (
                  <Box key={opt.id} sx={{ display: "flex" }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder={`Radio Option ${key + 1}`}
                      defaultValue={opt?.value}
                      key={opt?.id}
                      sx={{ mb: 1 }}
                      onBlur={(e) =>
                        handleOptionValues(item?.id, opt?.id, e.target.value)
                      }
                    />
                    <Tooltip title="Delete Option" aria-label="delete-option">
                      <IconButton
                        aria-label="delete-option"
                        onClick={() => deleteOption(item.id, opt?.id)}
                        sx={{ ml: 2 }}
                      >
                        <DeleteOutlineOutlinedIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              <Button variant="text" onClick={() => createNewOption(item.id)}>
                Add Option
              </Button>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="el-type-label">Type</InputLabel>
                <Select
                  labelId="el-type-label"
                  id="el-type"
                  label="Type"
                  value={item.type}
                  onChange={(e) => handleElType(item.id, e.target.value)}
                >
                  {formEl &&
                    formEl.map((el, key) => (
                      <MenuItem key={key} value={el.value}>
                        {el.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Divider light />
        <FormGroup row sx={{ alignItems: "center" }}>
          <Tooltip title="Delete Element" aria-label="delete-element">
            <IconButton
              aria-label="delete-element"
              onClick={() => deleteEl(item.id)}
              sx={{ ml: 2 }}
            >
              <DeleteOutlineOutlinedIcon color="secondary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate Element" aria-label="duplicate-element">
            <IconButton
              aria-label="duplicate-element"
              onClick={() => duplicateElement(item.id, item.type)}
              sx={{ ml: 2 }}
            >
              <FileCopyIcon color="secondary" />
            </IconButton>
          </Tooltip>

          <FormControlLabel
            control={
              <Switch
                checked={item.required}
                onChange={() => handleRequired(item.id)}
                name="required-field"
                color="secondary"
              />
            }
            label="Required"
            sx={{ ml: 2 }}
          />
        </FormGroup>
      </Paper>
    </Fragment>
  );
};

export default RadioInput;
