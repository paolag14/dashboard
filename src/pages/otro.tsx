import { useEffect, useState } from 'react';
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';
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
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, OutlinedInput } from '@mui/material';

const theme2 = createTheme();

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#737A80",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
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

  // state to keep track of the filtered data
   //const [filteredData, setFilteredData] = useState(allData.slice(1));
   const [filteredData, setFilteredData] = useState(allData);

   console.log(allData);

  const handleRowClick = (index:any) => {
    if (expandedRow === index) {
      setExpandedRow(-1);
    } else {
      setExpandedRow(index);
    }
    setSelectedService(selectedService);
    setSelectedPriority(selectedPriority);
    setSelectedStatus(selectedStatus);
  }

  const handleServiceChange = (event:any) => {
    const service = event.target.value;
    const priority = selectedPriority;
    const status = selectedStatus;
    
    if (service === "" && priority === "" && status === "") {
      setFilteredData(allData.slice(1));
    } else if (service === "" && priority === "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[5] === status);
      setFilteredData(newFilteredData);
    } else if (service === "" && priority !== "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[6] === priority);
      setFilteredData(newFilteredData);
    } else if (service === "" && priority !== "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[5] === status && row[6] === priority);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority === "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority === "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[5] === status);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority !== "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[6] === priority);
      setFilteredData(newFilteredData);
    } else {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[5] === status && row[6] === priority);
      setFilteredData(newFilteredData);
    }

    

    //const filtered = filterData(service, priority, status);
    //setFilteredData(filtered);

    setSelectedService(service);

    console.log("service: ", service);

  };

  const handlePriorityChange = (event:any) => {
    const priority = event.target.value;
    const service = selectedService;
    const status = selectedStatus;  
  
    if (service === "" && priority === "" && status === "") {
      setFilteredData(allData.slice(1));
    } else if (service === "" && priority !== "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[6] === priority);
      setFilteredData(newFilteredData);
    } else if (service === "" && priority === "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[5] === status);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority === "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority !== "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[6] === priority);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority === "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[5] === status);
      setFilteredData(newFilteredData);
    } else if (service === "" && priority !== "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[5] === status && row[6] === priority);
      setFilteredData(newFilteredData);
    } else {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[6] === priority && row[5] === status);
      setFilteredData(newFilteredData);
    }

    //const filtered = filterData(service, priority, status);
    //setFilteredData(filtered);

    setSelectedPriority(priority);
    console.log("priority: ", priority);
  };

  const handleStatusChange = (event:any) => {
    const status = event.target.value;
    const service = selectedService;
    const priority = selectedPriority;
      
    if (service === "" && priority === "" && status === "") {
      setFilteredData(allData.slice(1));
    } else if (service === "" && priority === "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[7] === status);
      setFilteredData(newFilteredData);
    } else if (service === "" && priority !== "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[6] === priority);
      setFilteredData(newFilteredData);
    } else if (service === "" && priority !== "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[6] === priority && row[7] === status);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority === "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority === "" && status !== "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[7] === status);
      setFilteredData(newFilteredData);
    } else if (service !== "" && priority !== "" && status === "") {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[6] === priority);
      setFilteredData(newFilteredData);
    } else {
      const newFilteredData = allData.slice(1).filter((row:any) => row[2] === service && row[6] === priority && row[7] === status);
      setFilteredData(newFilteredData);
    }

    /* const newFiltered = filterData(service, priority, status);
    setFilteredData(newFiltered); */
    setSelectedStatus(status);
    console.log("status: ", status);
  };


// handle text field value change
const handleSearchChange = (event) => {
  const value = event.target.value;
  setSearchValue(value);
}

// filter data based on search value
useEffect(() => {
  const filtered = allData.slice(1).filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );
  setFilteredData(filtered);
}, [searchValue, allData]);

  
   // create a set of services from the third column of allData
  const services = Array.from(new Set(allData.slice(1).map((row:any) => row[2] ? row[2] : null)))
  .filter(service => service !== null)
  .sort((a:any, b:any) => a.localeCompare(b));


  return(
    <>
    <br />
    <Typography variant='h3' align='center'>Tickets</Typography>
    <br />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <OutlinedInput
          value={searchValue}
          //onChange={handleSearchChange}
          placeholder="Search"
          sx={{ ml: 1, width: '100%' }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          
        />
        
      </Box>
    
    <br />
    <br />
    

    {/* Service filter */}
    <FormControl variant="outlined" className={classes.formControl}> 
      <InputLabel id="service-select-label">Select a service</InputLabel>
      <Select
        labelId="service-select-label"
        id="service-select"
        value={selectedService}
        onChange={handleServiceChange}
        label="Select a service"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
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


    {/* Priority filter */}
    <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="priority-select-label">Select a priority</InputLabel>
        <Select
          labelId="priority-select-label"
          id="priority-select"
          value={selectedPriority}
          onChange={handlePriorityChange}
          label="Select a priority"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
    </FormControl>

    {/* Status filter */}
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="status-select-label">Select a status</InputLabel>
      <Select
        labelId="status-select-label"
        id="status-select"
        value={selectedStatus}
        onChange={handleStatusChange}
        label="Select a status"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {/* Add menu items for each unique status in the "status" column of allData */}
        {Array.from(new Set(allData.slice(1).map((row: any[]) => row[7]))).map(status => (
          <MenuItem key={status} value={status}>{status}</MenuItem>
        ))}
      </Select>
    </FormControl>
  
    <br /><br />


    <TableContainer component={Paper}>
    <Table  sx={{minWidth: 700}} aria-label="collapsible table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell> 
            {allData[0].slice(0, -16).map((header:any) => (
            <StyledTableCell><Typography variant="h6">{header}</Typography></StyledTableCell>
          ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row:any, index:any) => (
            <>
              <StyledTableRow key={index} onClick={() => handleRowClick(index)}>
                <StyledTableCell>
                  <IconButton aria-label="expand row" size="small" onClick={() => handleRowClick(index)}>
                    {expandedRow === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </StyledTableCell>
                {row.slice(0, -16).map((cell:any) => (
                  <TableCell>{cell}</TableCell>
                ))}
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={allData[0].length}>
                  <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                    <Table size="small" aria-label="details">
                    <TableHead>
                      <br />
                    <Typography> <strong>Details</strong> </Typography>
              

                    {allData[0].slice(-16).map((header:any, headerIndex:any) => (
                        <TableRow key={headerIndex}>
                        <TableCell> {header}: {row[row.length - 16 + headerIndex]}  </TableCell>
                        </TableRow>
                    ))}
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

    </Box>
   
    </>
  )
}
