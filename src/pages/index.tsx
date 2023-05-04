import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import styles from '../styles/Home.module.css'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';


import * as XLSX from "xlsx";
import { useState } from 'react';

import { Link } from 'react-router-dom';


import { ExcelImport } from './ExcelImport';
  

export default function Home() {
  const [fileName, setFileName] = useState(null);

  const [columns, setColumns] = useState([]);
  const [total, setTotal] = useState(0);
  const [solved, setSolved] = useState(0);
  const [closed, setClosed] = useState(0);
  const [forwarded, setForwarded] = useState(0);
  const [reopened, setReopened] = useState(0);

  const [data, setData] = useState([]);

  const handleFile = async (e: any) =>{
    
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    //esto da la primera página del excel
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    //convierte a array de arrays
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval:"",
    });

    //leer como json
    //const jsonData = XLSX.utils.sheet_to_json(worksheet);


    //jsonData[0] son el nombre de todas las columnas cuando es array
    setColumns(jsonData[0]);

    //set data
    setData(jsonData);

    let allData = jsonData;


    //obtener total de tickets en archivo
    let counter = 0;
    for (var item of jsonData){
      counter++;
    }
    setTotal(counter-1);

    //contar específico
    //esto se puede hacer función para cada columna y valor específico
    let contadorS = 0;
    for (let i = 1; i<jsonData.length-1; i++){
      if (jsonData[i][6] === "Medium"){
        contadorS++;
      }
    }

    //contar resueltos
    let contadorSolved = 0;
    for (let i = 1; i<jsonData.length-1; i++){
      if (jsonData[i][7] === "Resolved" && jsonData[i][14] === 1 ){ //columna status y solved=1
        contadorSolved++;
      }
    }
    setSolved(contadorSolved);

    //contar closed
    let contadorClosed = 0;
    for (let i = 1; i<jsonData.length-1; i++){
      if (jsonData[i][7] === "Closed"){
        contadorClosed++;
      }
    }
    setClosed(contadorClosed);

    //contar forwarded
    let contadorForwarded = 0;
    for (let i = 1; i<jsonData.length-1; i++){
      if (jsonData[i][16] === 1){
        contadorForwarded++;
      }
    }
    setForwarded(contadorForwarded);

    //contar reopen
    let contadorReopened = 0;
    for (let i = 1; i<jsonData.length-1; i++){
      if (jsonData[i][15] === 1){
        contadorReopened++;
      }
    }
    setReopened(contadorReopened);




    console.log(jsonData);

    console.log("esto es el id:" , jsonData[1][0]);
    console.log("total de filas", jsonData.length -1);
    console.log("contar medium", contadorS);

   
  }





    return( 
        <>
                
        <Container>

        
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


        <br></br>

        

        <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 1, pb: 1 }} >
            
        <Grid container spacing={4} alignItems="center" justifyContent="center">
            

            {/* Total de tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, height: 300 }}>
            
                <CardActionArea href="/tickets">
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Total tickets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {total}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                
                </Card>
            </Grid>


            {/*Resolved tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, height: 300 }}>
            
                <CardActionArea href="/">
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Resolved tickets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {solved}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                
                </Card>
            </Grid>


             {/*Closed tickets*/}
             <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, height: 300 }}>
            
                <CardActionArea href="/">
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Closed tickets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {closed}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                
                </Card>
            </Grid>


            {/*Forwarded tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, height: 300 }}>
            
                <CardActionArea href="/">
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Forwarded tickets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {forwarded}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
            </Grid>



            {/*Reopen tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, height: 300 }}>
            
                <CardActionArea href="/">
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Reopened tickets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {reopened}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
            </Grid>


            {/*Backlog tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, height: 300 }}>
            
                <CardActionArea href="/">
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Backlog
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        poner variable
                    </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
            </Grid>



           
        </Grid>
        </Container>

    </Container>
        
        
        </>
    );
}