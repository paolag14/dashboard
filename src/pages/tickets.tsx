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
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';


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
   const [filteredData, setFilteredData] = useState(allData.slice(1));
   //const [filteredData, setFilteredData] = useState(allData);

   // state to clear filters
   const [resetFilters, setResetFilters] = useState(false);

   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(25);

   const indexOfLastRow = (page + 1) * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
   const paginatedData = filteredData.slice(indexOfFirstRow, indexOfLastRow);


   console.log("data recibida", allData);


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
  

  const handleFilterChange = (service:any, priority:any, status:any) => {
    const filteredData = allData.slice(1).filter((row:any) => {
      const serviceMatch = service === "" || row[2] === service;
      const priorityMatch = priority === "" || row[6] === priority;
      const statusMatch = status === "" || row[7] === status;
      return serviceMatch && priorityMatch && statusMatch;
    });
    setFilteredData(filteredData);
  };
  
  const handleServiceChange = (event:any) => {
    const service = event.target.value;
    handleFilterChange(service, selectedPriority, selectedStatus);
    setSelectedService(service);
  };
  
  const handlePriorityChange = (event:any) => {
    const priority = event.target.value;
    handleFilterChange(selectedService, priority, selectedStatus);
    setSelectedPriority(priority);
  };
  
  const handleStatusChange = (event:any) => {
    const status = event.target.value;
    handleFilterChange(selectedService, selectedPriority, status);
    setSelectedStatus(status);
  };
  

  const handleSearchChange = (event:any) => {
        const value = event.target.value;
        setSearchValue(value);
      
        const filtered = allData.slice(1).filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchValue.toLowerCase())
          )
        );
        setFilteredData(filtered);
  };
      
      
  const handleResetFilters = () => {
    setResetFilters(true);
    };

    if (resetFilters) {
    setFilteredData(allData.slice(1));
    setSelectedService('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSearchValue('');
    setResetFilters(false);
  }

  if (resetFilters) {
    setFilteredData(allData.slice(1));
    setSelectedService('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSearchValue('');
    setResetFilters(false);
  }


// filter data based on search value
/* useEffect(() => {
  const filtered = allData.slice(1).filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );
  setFilteredData(filtered);
}, [searchValue, allData]);
 */
  
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
          onChange={handleSearchChange}
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


    <Stack direction="row" spacing={2} alignItems="center">

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

    
    <Box marginLeft="auto">
      <Button variant="outlined" onClick={handleResetFilters} startIcon={<ClearIcon />}>
        Clear
      </Button>
    </Box>

    </Stack>

    
  
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
          {paginatedData.map((row:any, index:any) => (
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
                        <TableCell > 
{/*                           <Typography sx={{ fontWeight: 'bold'  }}> {header}: </Typography>  {row[row.length - 16 + headerIndex]}  
 */}                          <Typography  display="inline" sx={{ fontSize: "13px", fontWeight: "bold" }}>
                                        {header}: {" "}
                                        <Typography display="inline" sx={{ fontSize: "13px" }} >
                                          {row[row.length - 16 + headerIndex]}
                                        </Typography>
                                        <Typography> </Typography>
                                    </Typography>
                          </TableCell>
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
    <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />

    </Box>
   
    </>
  )
}
