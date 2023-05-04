import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { ExcelImport } from './ExcelImport';
import { useState } from 'react';

export const ReadExcel = ()  =>{

    const [sheetData, setSheetData] = useState("");
    //const [sheet, setSheet] = useState(null);

    const handleFileUploaded = async (e: any) =>{
        console.log("file uploaded", e);

        if(e){
            //setSheet(Object.keys(e)[0]);
        }

        setSheetData(e);

    }

  return (
    <>
    <div>
    <ExcelImport onFileUploaded ={(e: any) => handleFileUploaded(e)}></ExcelImport> 
    </div> 

    {sheetData && 

    <TableContainer component={Paper}>
       <Table aria-label="collapsible table">
       <TableHead>
          <TableRow>
            {sheetData[0].map(
                (h:any) => <TableCell key={h}> <Typography variant="h6" >{h}</Typography>  </TableCell>
            )}
        
          </TableRow>
        </TableHead>

        <TableBody>
            {sheetData.slice(1).map((row:any) => (
                <TableRow>
                    {row.map((c:any)=> <TableCell key={c}> <Typography variant="subtitle1">{c}</Typography>  </TableCell>)}

                </TableRow>
            )
                )}
          
        </TableBody>

       </Table> 
    </TableContainer>
    };

    </>
  );
}

export default ReadExcel;