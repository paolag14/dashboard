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
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
  isSelected: {
    backgroundColor: "#23237d", 
    color: "white",
    borderRadius: 6,
  },
  notSelected:{
    borderRadius: 6,
  },
  othersButtons:{
    borderRadius: 6,
    backgroundColor: "#4D4D52",
  }

});

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

  // state to keep track of the filtered data
   const [filteredData, setFilteredData] = useState(allData.slice(1));

   console.log("data filtrada", filteredData);
   //const [filteredData, setFilteredData] = useState(allData);

   // state to clear filters
   const [resetFilters, setResetFilters] = useState(false);

   const rowsPerPage = 10; // Define the number of rows to display per page

   const [currentPage, setCurrentPage] = useState(0);

   const [currentPageData, setCurrentPageData] = useState([]);


/*    console.log("data slice", paginatedData[0].slice(0, 3).
    concat(paginatedData[0].slice(4,5)).
    concat(paginatedData[0].slice(6,11)));
 */

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
    setCurrentPage(0);
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
  
   // create a set of services from the third column of allData
  const services = Array.from(new Set(allData.slice(1).map((row:any) => row[2] ? row[2] : null)))
  .filter(service => service !== null)
  .sort((a:any, b:any) => a.localeCompare(b));

  const headers = ["Incident Number", "Summary", "Service", "Support Group", "Priority", "Status", "Creation Date", "Reopened Date",
    "Solved Date"];
  /* headers
  allData[0].slice(0, 3).
                concat(allData[0].slice(4,5)).
                concat(allData[0].slice(6,11))
                 */

  /* headers details 
  paginatedData.slice(0,3).
            concat(paginatedData.slice(4,5)).
            concat(paginatedData.slice(6,11)) */

  const headersDetails = ["Open", "Solved", "Reopened", "Forwarded", "Assignee ID", "Assignee Name", "Category", "Forwarded to Group", "Reopened Reason", 
    "Last Assigned On", "Duration in Days"];

  const assigneeName = Array.from(new Set(allData.slice(1).map((row:any) => {
      if (row[4] === "Order Management Customizing and Services") {
        return row[18] ? row[18] : null;
      }
  })));

  console.log("team", assigneeName);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const startIndex = currentPage * rowsPerPage;
  const endIndex = (currentPage + 1) * rowsPerPage;

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const start = currentPage * rowsPerPage;
    const end = Math.min(start + rowsPerPage, filteredData.length); // Use Math.min to ensure the end index is not greater than the filtered data length
    setCurrentPageData(filteredData.slice(start, end));
  }, [currentPage, filteredData]);


  const renderPaginationItems = (item) => {
    const { type, page, selected, ...itemProps } = item;

    if (type === 'previous') {
      if (currentPage > 0) {
        return (
          <IconButton onClick={goToPreviousPage}>
            <ArrowBackIcon />
          </IconButton>
        );
      }
      return null;
    }

    if (type === 'next') {
      if (currentPage < totalPages - 1) {
        return (
          <IconButton onClick={goToNextPage}>
            <ArrowForwardIcon />
          </IconButton>
        );
      }
      return null;
    }

    if (type === 'page') {
      return (
        <PaginationItem
          {...itemProps}
          page={page}
          selected={selected || currentPage === page - 1}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#d2d2e4',
              color: 'black',
              borderRadius: 6,
            },
          }}
          onClick={() => goToPage(page - 1)}
        />
      );
    }

    return null;
  };

  


  return(
    <>
    <br />
    
    <Typography variant='h3' align='center' mt={2} sx={{fontWeight:400}}>Tickets</Typography>

    <Box width="95%" sx={{ backgroundColor: "#EB1C24", height: 10, mt:3, marginLeft: "auto", marginRight: "auto" }}></Box>
   
    
    <br />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

      <Paper elevation={3} sx={{ margin: 0 , width: '100%'}}>
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
      </Paper>


      {/* Priority filter */}
      <Paper elevation={3}>
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
      </Paper>

      {/* Status filter */}
      <Paper elevation={3}>
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
      </Paper>


      <Box marginLeft="auto">
        <Button variant="outlined" onClick={handleResetFilters} startIcon={<ClearIcon />}>
          Clear
        </Button>
      </Box>

    </Stack>

    <br /><br />

    <Paper elevation={3}>
    
    {/* <div>
      {currentPage > 0 && (
        <Button onClick={goToPreviousPage}
        variant="contained" component="span"
          style={{
             backgroundColor: "#000000",
             color: "white",
             borderRadius: 6,
          }}>Previous</Button>
      )}
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          className={`${currentPage === index ? classes.isSelected : classes.notSelected}`}
          key={index}
          onClick={() => goToPage(index)}
          variant="contained" component="span"
        >        
         {index + 1}
        </Button>
      ))}
      {currentPage < totalPages - 1 && (
        <Button 
          variant="contained" component="span"
          onClick={goToNextPage} 
          style={{
             backgroundColor: "#000000",
             color: "white",
             borderRadius: 6,
          }}
          >Next</Button>
      )}
    </div> */}
    
    <Box width={'100%'} display="flex" justifyContent="center">
      <Typography align='center'>Page: {currentPage + 1}</Typography>
      <Stack spacing={2}>
        <Pagination
          variant="outlined"
          size="large"
          count={totalPages}
          boundaryCount={totalPages - 1} // Set boundaryCount to the total number of pages minus 1
          siblingCount={0} 
         
          renderItem={(item) => {
            const { type, page, selected, ...itemProps } = item;

            if (type === 'previous') {
              if (currentPage > 0) {
                return (
                  <IconButton onClick={goToPreviousPage}>
                    <ArrowBackIcon />
                  </IconButton>
                );
              }
              return null;
            }

            if (type === 'next') {
              if (currentPage < totalPages - 1) {
                return (
                  <IconButton onClick={goToNextPage}>
                    <ArrowForwardIcon />
                  </IconButton>
                );
              }
              return null;
            }

            if (type === 'page') {
              return (
                <PaginationItem
              {...itemProps}
              page={page}
              selected={currentPage === page - 1}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#d2d2e4',
                  color: 'black',
                  borderRadius: 6,
                },
              }}
              component="button"
              onClick={() => goToPage(page - 1)}
            />
              );
            }


            return (
              <PaginationItem
                {...itemProps}
                page={page}
                selected={currentPage === page - 1}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#d2d2e4',
                    color: 'black',
                    borderRadius: 6,
                  },
                }}
                onClick={() => goToPage(page - 1)} // Subtract 1 from page to match index-based page numbering
              />
            );
          }}
        />
      </Stack>
    </Box>

    

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
              {currentPageData.map((row, index) => (
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
                                  {row[dataIndex] === "0" ? "No" : row[dataIndex] === "1" ? "Yes" : row[dataIndex]}
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

    </Paper>

    </Box>
   
    </>
  )
}