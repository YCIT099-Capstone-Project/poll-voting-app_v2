import { Fragment, useState } from "react";
import { Box } from "@mui/system";
import { TextField } from "@mui/material";
import { Paper } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Header = ({
  startDate,
  endDate,
  title,
  description,
  setTitle,
  setDescription,
  setStartDate,
  setEndDate,
}) => {
  return (
    <Fragment>
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #9C27B0" }}>
          <TextField
            defaultValue={title}
            onBlur={(e) => setTitle(e.target.value)}
            variant="standard"
            placeholder="Form Title"
            name="title"
            sx={{ mb: 3 }}
            fullWidth
          />
          <TextField
            name="description"
            defaultValue={description}
            onBlur={(e) => setDescription(e.target.value)}
            variant="standard"
            placeholder="Form Description"
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 2 }} />
              )}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 2 }} />
              )}
            />
          </LocalizationProvider>
        </Paper>
      </Box>
    </Fragment>
  );
};

export default Header;
