import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/material/Typography';



import { ExcelImport } from './ExcelImport';
import { useState } from 'react';


export const ReadExcel = (props:any)  =>{

    const [sheetData, setSheetData] = useState("");

    const [open, setOpen] = useState(false);


    const handleFileUploaded = async (e: any) =>{
        console.log("file uploaded", e);

        setSheetData(e);
       
    }

 
    

  return (
    <>
    <div>
    <ExcelImport onFileUploaded ={(e: any) => handleFileUploaded(e)}></ExcelImport> 
    </div> 

    {sheetData && 

    <React.Fragment>
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
      <TableHead>
          <TableRow>
            {sheetData[0].map(
                (h:any) => <TableCell key={h}> <Typography variant="h6">{h}</Typography>  </TableCell>
            )}
        
          </TableRow>
        </TableHead>

        <TableBody>
            {sheetData.slice(1).map((row:any) => (
                <><td>
                <IconButton
                  aria-label="expand row"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </td>
              
              <TableRow>
                  {row.map((c: any) => <TableCell key={c}> <Typography variant="subtitle1">{c}</Typography>  </TableCell>)}

                </TableRow></>
            )
                )}
          
        </TableBody>

      </Table> 
    </TableContainer>
    </React.Fragment>

}; 

    

     
    

    
    

    
      

    </>
  );
}

export default ReadExcel;