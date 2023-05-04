import React from "react";
import TableRow from '@mui/material/TableRow'; //row
import TableHead from '@mui/material/TableHead'; //column
import Input from '@mui/material/Input';
import * as XLSX from "xlsx";
import { useState } from 'react';


export const ExcelImport = (props:any) => {

    const [fileName, setFileName] = useState(null);
    const [file, setFile] = useState(null);

    const [columns, setColumns] = useState([]);
    const [total, setTotal] = useState(0);
    const [solved, setSolved] = useState(0);
    const [closed, setClosed] = useState(0);
    const [forwarded, setForwarded] = useState(0);
    const [reopened, setReopened] = useState(0);

    const [allData, setAllData] = useState();


    const readDataFromExcel = (data: any) => {
        const workbook = XLSX.read(data);

        //esto da la primera página del excel
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    
        //leer como json
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            blankrows: "",
            header: 1});

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
       <div>
       <Input type="file"  inputProps={{accept: '.xlsx,.xls'}} onChange={e => handleFile(e)}></Input>
        

       </div>

    )
}

export default ExcelImport;