import { Fragment } from "react";
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
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
//Icons
import {
  DragIndicator as DragIndicatorIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";

//Form Elements
import { formEl } from "../constants";

const DateInput = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  handleDate,
  duplicateElement,
}) => {
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
                placeholder="Date Label"
                sx={{ mb: 2 }}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={item?.date || new Date()} // use today's date if item?.date is not available
                  onChange={(newDate) => {
                    handleDate(item.id, newDate);
                  }}
                  components={{
                    TextField: TextField,
                  }}
                />
              </LocalizationProvider>
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

export default DateInput;
