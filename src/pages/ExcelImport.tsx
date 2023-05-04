import React from "react";
import TableRow from '@mui/material/TableRow'; //row
import TableHead from '@mui/material/TableHead'; //column
import Input from '@mui/material/Input';
import * as XLSX from "xlsx";
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/Home.module.css'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';


export const ExcelImport = (props:any) => {

    const [fileName, setFileName] = useState(null);
    const [file, setFile] = useState(null);

    const [allData, setAllData] = useState();


    const readDataFromExcel = (data: any) => {
        const workbook = XLSX.read(data);

        //para limitar filas
        //const workbook = XLSX.read(data, {sheetRows: 5, sheet});


        //esto da la primera página del excel
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    
        //leer como json
        /* const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            blankrows: "",
            header: 1}); */

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval:"",
        });

        //mySheetData es jsonData
        setAllData(jsonData);

        

    return jsonData;

    }

    const handleFile = async (e: any) =>{
    
        const myFile = e.target.files[0];
        if (!myFile) return;

        const data = await myFile.arrayBuffer();

        setFile(myFile);
        setFileName(myFile.name);

        const myData = readDataFromExcel(data);

        props.onFileUploaded(myData);
    
      }



    return (

   
        <>       
        <React.Fragment>     
        <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 1, pb: 1 }} >

        <Typography variant="h4" align="center">Tickets</Typography>
        <br></br>

        <div className='center'>
        <Input type="file"  inputProps={{accept: '.xlsx,.xls'}} onChange={e => handleFile(e)}></Input>
        </div>
        

        

        <br></br>

        <div className='center'>
        {fileName && (
        <React.Fragment> 
        <Typography variant="h5" align="center">File Name: <span>{fileName}</span></Typography>
        </React.Fragment>
        ) }

        </div>
        </Container>
        </React.Fragment>   
        </>

     
    )
}

export default ExcelImport;