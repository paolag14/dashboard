//Imports
import { useEffect, useState } from 'react';
import { makeStyles, createTheme } from '@material-ui/core/styles';
import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const theme2 = createTheme();

//Style forms
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme2.spacing(1),
    minWidth: 250,
    borderRadius: 6,
    p: 2,
  },
});

//Style table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4D4D52",
    color: theme.palette.common.white,
    //color: "#4D4D52"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    
  },
}));

//Style table rows
const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? "#D2D8D9" : theme.palette.action.hover,
  color: index % 2 === 0 ? theme.palette.common.white : '',

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function Tickets() {
  const router = useRouter();
  const { data } = router.query;
  const allData = JSON.parse(data);
  const classes = useStyles();

  const theme = useTheme();

  // state to keep track of which rows are expanded
  const [expandedRow, setExpandedRow] = useState(-1);

   // state to keep track of the selected service
   const [selectedService, setSelectedService] = useState('');

   // state to keep track of the selected priority
   const [selectedPriority, setSelectedPriority] = useState('');

   // state to keep track of the selected status
   const [selectedStatus, setSelectedStatus] = useState('');

   // state to keep track of the search input value
   const [searchValue, setSearchValue] = useState('');

  // state to keep track of the team selected
  const [selectedTeam, setSelectedTeam] = useState('');

  // state to keep track of the filtered data
  const [filteredData, setFilteredData] = useState(allData.slice(1));

  // state to keep track of the displayed data
  const [displayedData, setDisplayedData] = useState(allData.slice(1));

   // state to clear filters
   const [resetFilters, setResetFilters] = useState(false);

   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const [paginatedData, setPaginatedData] = useState([]);

  // Handle actions on row click
  const handleRowClick = (index:any) => {
    if (expandedRow === index) {
      setExpandedRow(-1);
    } else {
      setExpandedRow(index);
    }
    setSelectedService(selectedService);
    setSelectedPriority(selectedPriority);
    setSelectedStatus(selectedStatus);
    setSelectedTeam(selectedTeam);
  }

  // Handle actions of filters change
  const handleFilterChange = (service:any, priority:any, status:any, team:any) => {
    const filteredData = allData.slice(1).filter((row:any) => {
      const serviceMatch = service === "" || row[2] === service;
      const priorityMatch = priority === "" || row[6] === priority;
      const statusMatch = status === "" || row[7] === status;
      const teamMatch = team === "" || row[4] === team;

      return serviceMatch && priorityMatch && statusMatch && teamMatch;

    });
    setFilteredData(filteredData);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    setDisplayedData(paginatedData);

  };
  
  // Handle actions when service filter changes
  const handleServiceChange = (event:any) => {
    const service = event.target.value;
    handleFilterChange(service, selectedPriority, selectedStatus, selectedTeam);
    setSelectedService(service);
  };
  
  // Handle actions when priority filter changes
  const handlePriorityChange = (event:any) => {
    const priority = event.target.value;
    handleFilterChange(selectedService, priority, selectedStatus, selectedTeam);
    setSelectedPriority(priority);
  };

  // Handle actions when status filter changes
  const handleStatusChange = (event:any) => {
    const status = event.target.value;
    handleFilterChange(selectedService, selectedPriority, status, selectedTeam);
    setSelectedStatus(status);
  };

  // Handle actions when team (Support group) filter changes
  const handleTeamChange = (event:any) => {
    const team = event.target.value;
    handleFilterChange(selectedService, selectedPriority, selectedStatus, team);
    setSelectedTeam(team);
  };

  // Handle actions when search bar filter changes
  const handleSearchChange = (event:any) => {
    const value = event.target.value;
    setSearchValue(value);
      
     const filtered = allData.slice(1).filter((row:any) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchValue.toLowerCase())
          )
      );
    
    setFilteredData(filtered);
    setDisplayedData(filtered);
  };
         
  const handleResetFilters = () => {
    setResetFilters(true);
    };

    if (resetFilters) {
    setFilteredData(allData.slice(1));
    setDisplayedData(allData.slice(1));
    setSelectedService('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSearchValue('');
    setSelectedTeam('');
    setResetFilters(false);
  }

  const handlePageChange = (event:any, newPage:any) => {
    setPage(newPage);
    
    handleFilterChange(selectedService, selectedPriority, selectedStatus, selectedTeam);
     // Update displayedData based on filteredData and pagination
     const startIndex = newPage * rowsPerPage;
     const endIndex = startIndex + rowsPerPage;
     const paginatedData = filteredData.slice(startIndex, endIndex);
     setDisplayedData(paginatedData);
  };

  const handleRowsPerPageChange = (event:any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);

     // Update displayedData based on filteredData and new pagination
     const paginatedData = filteredData.slice(0, event.target.value);
     setDisplayedData(paginatedData);
  };

  // Create a set of services 
  const services = Array.from(new Set(allData.slice(1).map((row:any) => row[2] ? row[2] : null)))
  .filter(service => service !== null)
  .sort((a:any, b:any) => a.localeCompare(b));

  // Create set of support groups
  const supportGroups = Array.from(new Set(allData.slice(1).map((row:any) => row[4] ? row[4] : null)))
  .filter(team => team !== null)
  .sort((a:any, b:any) => a.localeCompare(b));

  // Create set of OMCS support group assignee names
  const assigneeName = Array.from(new Set(allData.slice(1).map((row:any) => {
    if (row[4] === "Order Management Customizing and Services") {
      return row[18] ? row[18] : null;
    }
  })));


  const headers = ["Incident Number", "Summary", "Service", "Support Group", "Priority", "Status", "Creation Date", "Reopened Date",
    "Solved Date"];
 
  const headersDetails = ["Open", "Solved", "Reopened", "Forwarded", "Assignee ID", "Assignee Name", "Category", "Forwarded to Group", "Reopened Reason", 
    "Last Assigned On", "Duration in Days"];


  useEffect(() => {
    // Filter the data based on selected filters and search value
    const filtered = allData.slice(1).filter((row:any) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setFilteredData(filtered);
  
    // Reset the page to the first page when the filtered data changes
  }, [allData, searchValue, selectedService, selectedPriority, selectedStatus, selectedTeam]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  useEffect(() => {
    // Update paginatedData when filteredData or page changes
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedData = filteredData.slice(startIndex, endIndex);
    setPaginatedData(displayedData);
  }, [filteredData, page, rowsPerPage]);
  
  

  return(
    <>
    <br />

    {/* Back button */}
    <Box position="absolute" top={30} left={40} sx={{ width: 300 }}>
        <Button
          variant="outlined"
          component="span"
          style={{
            color: "#4D4D52",
            padding: "9px 18px",
            borderColor: "#4D4D52", 
          }}
          onClick={() => {
            window.location.href = "/"; 
          }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
    </Box>
    
    <Typography variant='h3' align='center' mt={2} sx={{fontWeight:400}}>Tickets</Typography>

    <Box width="95%" sx={{ backgroundColor: "#EB1C24", height: 10, mt:3, marginLeft: "auto", marginRight: "auto" }}></Box>
    
    <br />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

      <Paper elevation={3} style={{ margin: 0 , width: '100%'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <OutlinedInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search"
            sx={{  width: '100%' }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Box>
      </Paper>
    
    <br />
    <br />

    <Stack direction="row" spacing={2} alignItems="center">

      {/* Service filter */}
      <Paper elevation={3}>
        <FormControl variant="outlined" className={classes.formControl}> 
          <InputLabel id="service-select-label">Select a Service</InputLabel>
          <Select
            labelId="service-select-label"
            id="service-select"
            value={selectedService}
            onChange={handleServiceChange}
            label="Select a Service"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              maxHeight: 57,
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.from(services).map((service:any) => (
              <MenuItem key={service.toString()} value={service.toString()}>{service}</MenuItem>

            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Support Group filter */}
      <Paper elevation={3}>
        <FormControl variant="outlined" className={classes.formControl}> 
          <InputLabel id="team-select-label">Select a Support Group</InputLabel>
          <Select
            labelId="team-select-label"
            id="team-select"
            value={selectedTeam}
            onChange={handleTeamChange}
            label="Select a Support Group"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              maxHeight: 57,
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.from(supportGroups).map((team:any) => (
              <MenuItem key={team.toString()} value={team.toString()}>{team}</MenuItem>

            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Priority filter */}
      <Paper elevation={3}>
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="priority-select-label">Select a Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={selectedPriority}
              onChange={handlePriorityChange}
              label="Select a Priority"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
        </FormControl>
      </Paper>

      {/* Status filter */}
      <Paper elevation={3}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="status-select-label">Select a Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Select a Status"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {/* Add menu items for each unique status in the "status" column of allData */}
            {Array.from(new Set(allData.slice(1).map((row: any[]) => row[7]))).map(status => (
              <MenuItem key={status as string} value={status as string}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Clear button */}
      <Box marginLeft="auto">
        <Button variant="outlined" onClick={handleResetFilters} startIcon={<ClearIcon />}>
          Clear
        </Button>
      </Box>

    </Stack>

    <br /><br />

    <Paper elevation={3}>
    
    <TableContainer component={Paper}>
    <Table  sx={{minWidth: 700}} aria-label="collapsible table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell> 

            {headers.map((header:any) => (
            <StyledTableCell><Typography variant="h6">{header}</Typography></StyledTableCell>
          ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {displayedData.map((row:any, index:any) => (
          <>
            <StyledTableRow key={index} index={index} onClick={() => handleRowClick(index)}>
              <StyledTableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => handleRowClick(index)}>
                  {expandedRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </StyledTableCell>
              {/* Map columns 0 to 2 */}
              {row.slice(0, 3).map((cell:any, cellIndex:any) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
              {/* Map column 4 */}
              <TableCell style={{
                        fontWeight: row[4] && row[4].includes("Order Management Customizing and Services") ? "bold" : "normal"
                }}>{row[4]}</TableCell>
              {/* Map columns 6 to 10 */}
              {row.slice(6, 11).map((cell:any, cellIndex:any) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </StyledTableRow>

              <StyledTableRow key={index} index={index}>
                <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={allData[0].length}>
                  <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                    <Table size="small" aria-label="details">
                    <TableHead>
                      <br />
                    <Typography> <strong>Details</strong> </Typography>

                    {allData[0].slice(13, 20)
                        .concat(allData[0].slice(33, 34))
                        .concat(allData[0].slice(35, 38))
                        .map((header: any, headerIndex: any, index:any) => {
                            const dataIndex =
                            headerIndex < 7
                                ? headerIndex + 13
                                : headerIndex === 7
                                ? 33
                                : headerIndex === 8
                                ? 35
                                : headerIndex === 9
                                ? 36
                                : 37;
                                
                            return (
                            <TableRow key={headerIndex}>
                                <TableCell>
                                <Typography display="inline" sx={{ fontSize: "13px", fontWeight: "bold" }}>
                                  {headersDetails[headerIndex]}:{" "} 
                                </Typography>
                                <Typography display="inline"
                                    sx={{
                                      fontSize: "13px",
                                      textDecoration: assigneeName.includes(row[dataIndex]) ? "underline" : "none"
                                    }}>
                                  {row[dataIndex] && row[dataIndex].startsWith("OTHERS:")
                                    ? row[dataIndex].substring(7)
                                    : row[dataIndex] === "0"
                                    ? "No"
                                    : row[dataIndex] === "1"
                                    ? "Yes"
                                    : row[dataIndex]}
                                  {assigneeName.includes(row[dataIndex]) ? " (OMCS Team)" : ""}

                                </Typography>
                                <Typography> </Typography>
                                </TableCell>
                            </TableRow>
                            );
                    })}

                    </TableHead>

                    </Table>
                  </Collapse>
                </StyledTableCell>
              </StyledTableRow>
            </>
          ))}
        </TableBody>
        
      </Table>
    </TableContainer>

    <TablePagination
      rowsPerPageOptions={[10, 25, 50, 100]}
      component="div"
      count={filteredData.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />

    </Paper>

    </Box>
   
    </>
  )
}