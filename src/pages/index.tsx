import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import Container from '@mui/material/Container';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as XLSX from "xlsx";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@mui/material/Tooltip';
import DonutChart from '@/components/donutChart';


const useStyles = makeStyles(theme => ({
  iconHover: {
    '&:hover': {
      border: '2px solid green',
      //TODO display the text CREATE ITEM instead of AddIcon
    }
  },

  floatBtn: {
    marginRight: theme.spacing(1),
  },
}));


export default function Home(props:any) {
  const [fileName, setFileName] = useState(null);

  //cards
  const [total, setTotal] = useState(0);
  const [solved, setSolved] = useState(0);
  const [closed, setClosed] = useState(0);
  const [forwarded, setForwarded] = useState(0);
  const [reopened, setReopened] = useState(0);

  //inside card total
  const [low, setLow] = useState(0);
  const [medium, setMedium] = useState(0);
  const [high, setHigh] = useState(0);
  const [critical, setCritical] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [pending, setPending] = useState(0);
  const [resolved, setResolved] = useState(0);

  //inside card resolved
  const [lowR, setLowR] = useState(0);
  const [mediumR, setMediumR] = useState(0);
  const [highR, setHighR] = useState(0);
  const [criticalR, setCriticalR] = useState(0);

  //inside card closed
  const [lowC, setLowC] = useState(0);
  const [mediumC, setMediumC] = useState(0);
  const [highC, setHighC] = useState(0);
  const [criticalC, setCriticalC] = useState(0);

  //inside card forwarded
  const [lowF, setLowF] = useState(0);
  const [mediumF, setMediumF] = useState(0);
  const [highF, setHighF] = useState(0);
  const [criticalF, setCriticalF] = useState(0);

  //inside card reopened
  const [lowReopened, setLowReopened] = useState(0);
  const [mediumReopened, setMediumReopened] = useState(0);
  const [highReopened, setHighReopened] = useState(0);
  const [criticalReopened, setCriticalReopened] = useState(0);


  // data
  const [allData, setData] = useState("");
  const [resolvedData, setResolvedData] = useState("");
  const [closedData, setClosedData] = useState("");
  const [forwardedData, setForwardedData] = useState("");
  const [reopenedData, setReopenedData] = useState("");

  const [backlog, setBacklog] = useState(false);
  const [openTickets, setOpenTickets] = useState(0);
  const [backlogTotal, setBacklogTotal] = useState(0);

  const [restrictionTotal, setRestrictionTotal] = useState(0);

  //hover card total
  const [hover, setHover] = useState(false);

  //hover card resolved
  const [hoverR, setHoverR] = useState(false);

  //hover card closed
  const [hoverC, setHoverC] = useState(false);

  //hover card forwarded
  const [hoverF, setHoverF] = useState(false);

   //hover card reopened
   const [hoverReopened, setHoverReopened] = useState(false);

  //hover card backlog
  const [hoverBacklog, setHoverBacklog] = useState(false);


  const router = useRouter();
  
  const handleFile = async (e: any) =>{
    
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();

    //todo el archivo
    const workbook = XLSX.read(data);

    //primeras 50 filas
    //const workbook = XLSX.read(data, {sheetRows:50});

    //esto da la primera página del excel
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    //convierte a array de arrays
    /* const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval:"",
    }); */

    //leer como json
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      //blankrows: "",
      header: 1,
      raw: false,
      //dateNF: "DD/MM/YYYY hh:mm:ss",
    });

    const moment = require('moment-timezone')

    const formattedData = jsonData.slice(1).map(row => {
      let dateString = String(row[8]);
      const momentDate = moment(dateString, "DD/MM/YYYY hh:mm:ss a");
      const isFormatDayFirst = momentDate.date() > 12;
    
      const formattedDate = momentDate
        .tz('America/Mexico_City')
        .format(`${isFormatDayFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY'} HH:mm:ss`);
      row[8] = formattedDate;
    
      // Format rows 9 and 10 as well
      for (let i = 9; i <= 10; i++) {
        const stringVal = row[i];
        if (stringVal !== null && stringVal !== '') {
          const momentString = moment(stringVal, "DD/MM/YYYY hh:mm:ss a");
          const isFormatDayFirst2 = momentString.date() > 12;
          if (momentString.isValid()) {
            const formattedString = momentString
              .tz('America/Mexico_City')
              .format(`${isFormatDayFirst2 ? 'DD/MM/YYYY' : 'MM/DD/YYYY'} HH:mm:ss`);
            row[i] = formattedString;
          }
        }
      }
    
      return row;
    });
    
    console.log(formattedData);

  
    //jsonData[0] son el nombre de todas las columnas cuando es array

    //set data
    setData(jsonData);

    //obtener total de tickets en archivo
    let counter = 0;
    for (var item of jsonData){
      counter++;
    }
    setTotal(counter-1);

    //contar 
    let contadorSolved = 0;
    let contadorClosed = 0;
    let contadorForwarded = 0;
    let contadorReopened = 0;

    //contadores generales
    let contadorLow = 0;
    let contadorMedium = 0;
    let contadorHigh = 0;
    let contadorCritical = 0;

    //contadores card total
    let contadorAssigned = 0;
    let contadorInProgress = 0;
    let contadorPending = 0;
    let contadorResolved = 0;

    //contadores card resolved
    let contadorLowR = 0;
    let contadorMediumR = 0;
    let contadorHighR = 0;
    let contadorCriticalR = 0;

    //contadores card closed
    let contadorLowC = 0;
    let contadorMediumC = 0;
    let contadorHighC = 0;
    let contadorCriticalC = 0;

    //contadores card forwarded
    let contadorLowF = 0;
    let contadorMediumF = 0;
    let contadorHighF = 0;
    let contadorCriticalF = 0;

    //contadores card reopened
    let contadorLowReopened = 0;
    let contadorMediumReopened  = 0;
    let contadorHighReopened  = 0;
    let contadorCriticalReopened  = 0;

    let contadorOpenedTickets = 0;


    let arrayResolved=[];
    let arrayClosed=[];
    let arrayForwarded=[];
    let arrayReopened=[];
    arrayResolved.push(jsonData[0]);
    arrayClosed.push(jsonData[0]);
    arrayForwarded.push(jsonData[0]);
    arrayReopened.push(jsonData[0]);
   

    for (let i = 1; i<jsonData.length; i++){

      //backlog
      if(jsonData[i][13] == "1"){
        contadorOpenedTickets++;
      }

        //total tickets 
      if (jsonData[i][6] == "Low"){
        contadorLow++;
      }

      if (jsonData[i][6] == "Medium"){
        contadorMedium++;
      }

      if (jsonData[i][6] == "High"){
        contadorHigh++;
      }

      if (jsonData[i][6] == "Critical"){
        contadorCritical++;
      }


      //Assigned
      if (jsonData[i][7] === "Assigned"){
        contadorAssigned++;
      }

      //In progress
      if (jsonData[i][7] === "In Progress"){
        contadorInProgress++;
      }

      //Pending
      if (jsonData[i][7] === "Pending"){
        contadorPending++;
      }

      //Resolved
      if (jsonData[i][7] === "Resolved"){
        contadorResolved++;
      }

        //solved
      if (jsonData[i][7] === "Resolved" && jsonData[i][14] === "1" ){ //columna status y solved=1
        contadorSolved++;
        arrayResolved.push(jsonData[i]);

        if (jsonData[i][6] == "Low"){
          contadorLowR++;
        }
  
        if (jsonData[i][6] == "Medium"){
          contadorMediumR++;
        }
  
        if (jsonData[i][6] == "High"){
          contadorHighR++;
        }
  
        if (jsonData[i][6] == "Critical"){
          contadorCriticalR++;
        }
        
      }


        //closed
      if (jsonData[i][7] === "Closed"){
        contadorClosed++;
        arrayClosed.push(jsonData[i]);

        if (jsonData[i][6] == "Low"){
          contadorLowC++;
        }
  
        if (jsonData[i][6] == "Medium"){
          contadorMediumC++;
        }
  
        if (jsonData[i][6] == "High"){
          contadorHighC++;
        }
  
        if (jsonData[i][6] == "Critical"){
          contadorCriticalC++;
        }
      }


        //forwarded
      if (jsonData[i][16] === "1"){
        contadorForwarded++;
        arrayForwarded.push(jsonData[i]);

        if (jsonData[i][6] == "Low"){
          contadorLowF++;
        }
  
        if (jsonData[i][6] == "Medium"){
          contadorMediumF++;
        }
  
        if (jsonData[i][6] == "High"){
          contadorHighF++;
        }
  
        if (jsonData[i][6] == "Critical"){
          contadorCriticalF++;
        }
      }


        //reoponed
      if (jsonData[i][15] === "1"){
        contadorReopened++;
        arrayReopened.push(jsonData[i]);

        if (jsonData[i][6] == "Low"){
          contadorLowReopened++;
        }
  
        if (jsonData[i][6] == "Medium"){
          contadorMediumReopened++;
        }
  
        if (jsonData[i][6] == "High"){
          contadorHighReopened++;
        }
  
        if (jsonData[i][6] == "Critical"){
          contadorCriticalReopened++;
        }
      }
      
    }

    //set generales
    setSolved(contadorSolved);
    setClosed(contadorClosed);
    setForwarded(contadorForwarded);
    setReopened(contadorReopened);
    
    //set card total
    setLow(contadorLow);
    setMedium(contadorMedium);
    setHigh(contadorHigh);
    setCritical(contadorCritical);

    setAssigned(contadorAssigned);
    setPending(contadorPending);
    setInProgress(contadorInProgress);
    setResolved(contadorResolved);

    //set card resolved
    setLowR(contadorLowR);
    setMediumR(contadorMediumR);
    setHighR(contadorHighR);
    setCriticalR(contadorCriticalR);

    //set card closed
    setLowC(contadorLowC);
    setMediumC(contadorMediumC);
    setHighC(contadorHighC);
    setCriticalC(contadorCriticalC);

    //set card forwarded
    setLowF(contadorLowF);
    setMediumF(contadorMediumF);
    setHighF(contadorHighF);
    setCriticalF(contadorCriticalF);

    //set card reopened
    setLowReopened(contadorLowReopened);
    setMediumReopened(contadorMediumReopened);
    setHighReopened(contadorHighReopened);
    setCriticalReopened(contadorCriticalReopened);

    setOpenTickets(contadorOpenedTickets);


    //data arrays
    setResolvedData(arrayResolved);
    setClosedData(arrayClosed);
    setForwardedData(arrayForwarded);
    setReopenedData(arrayReopened);


    let restriction = (counter-1) * 0.5;

    //Backlog: cuantos quedaron abiertos contra cuantos fueron asignados. Esto no debe exceder más del 5% del total del mes. 
    
    //setBacklog(((contadorOpenedTickets/contadorAssigned)*100));

    if (((contadorOpenedTickets/contadorAssigned)*100) > restriction){
      setBacklog(true);
    }

    setRestrictionTotal(restriction);

    setBacklogTotal(((contadorOpenedTickets/contadorAssigned)*100))    

  }


    return( 
        <>
                
        <Container>
        <br />

        <Typography variant="h3" align="center">Tickets</Typography>
        <br></br>

        <div className='center'>
        <Input type="file"  inputProps={{accept: '.xlsx,.xls'}} onChange={e => handleFile(e)}></Input>
        </div>

        <br></br>
       
        <div className='center'>
        {fileName && (
          <React.Fragment> 
        <Typography variant="h4" align="center">File Name: <span>{fileName}</span></Typography>
          </React.Fragment>
        ) }
        
        </div>

        <br></br>

        <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 1, pb: 1 }} >
            
        <Grid container spacing={4} alignItems="center" justifyContent="center">
            

            {/* Total de tickets*/}
            <Grid item xs={3}>
              <Tooltip title= {
                <Typography gutterBottom variant="subtitle2" component="div">
                See all tickets </Typography>} arrow>

                <Card sx={{ maxWidth: 300, minHeight: 300 }}>
              
                  <CardActionArea >
                    
                  <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(allData) } }}>

                      <CardContent 
                          onMouseOver={() => setHover(true)}
                          onMouseOut={() => setHover(false)} >
                    
                        <Typography gutterBottom variant="h5" component="div">
                            Total tickets
                          
                        </Typography>

                        <Typography variant="h6" color="text.secondary">
                            <Box sx={{ fontWeight: 'bold' }}> {total} </Box>
                        </Typography>


                        {fileName && (
                          <DonutChart data={{ 
                            labels: ['Resolved', 'Closed', 'Forwarded', 'Reopened'], 
                            values: [solved, closed, forwarded, reopened], 
                            colors: ['#74b72e', '#FF7518', '#FFBF00', '#FF0000'] }} />

                        )}

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                <Box sx={{ fontWeight: 'bold' }}> Priority </Box>
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Low: " + low.toString()
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Medium: " + medium.toString()
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "High: " + high.toString() 
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Critical: " + critical.toString() 
                            : null} 
                        </Typography>

                        <br />

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                <Box sx={{ fontWeight: 'bold' }}> Status </Box>
                            : null} 
                        </Typography> 

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Assigned: " + assigned.toString() 
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Closed: " + closed.toString() 
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "In Progress: " + inProgress.toString() 
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Pending: " + pending.toString() 
                            : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            {hover? 
                                "Resolved: " + resolved.toString() 
                            : null} 
                        </Typography>
                    
                      </CardContent>

                  </Link>
                  </CardActionArea>
                  
                </Card>
              </Tooltip>
            </Grid>


            {/*Resolved tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
            
                <CardActionArea >
                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(resolvedData) } }}> 
                  <CardContent 
                        onMouseOver={() => setHoverR(true)}
                        onMouseOut={() => setHoverR(false)} >
                    <Typography gutterBottom variant="h5" component="div">
                        Resolved tickets
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {solved}
                    </Typography>

                    {fileName && (
                       <DonutChart data={{ 
                        labels: ['Low', 'Medium', 'High', 'Critical'], 
                        values: [lowR, mediumR, highR, criticalR], 
                        colors: ['#FFEE99', '#FF9F00', '#FF4500', '#E12901'] }} />

                    )}
                    <br />

                    <Typography variant="subtitle1" color="text.secondary">
                        {hoverR? 
                            <Box sx={{ fontWeight: 'bold' }}> Priority </Box>
                        : null} 
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                        {hoverR? 
                            "Low: " + lowR.toString()
                        : null} 
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                        {hoverR? 
                            "Medium: " + mediumR.toString()
                        : null} 
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                        {hoverR? 
                            "High: " + highR.toString() 
                        : null} 
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                        {hoverR? 
                            "Critical: " + criticalR.toString() 
                        : null} 
                    </Typography>

                    </CardContent>
                </Link>
                </CardActionArea>
                
                </Card>
            </Grid>


             {/*Closed tickets*/}
             <Grid item xs={3}>
              <Card sx={{ maxWidth: 300, minHeight: 300 }}>
              
                  <CardActionArea >
                  <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(closedData) } }}>
                    <CardContent 
                            onMouseOver={() => setHoverC(true)}
                            onMouseOut={() => setHoverC(false)} >
                      <Typography gutterBottom variant="h5" component="div">
                          Closed tickets
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                          {closed}
                      </Typography>

                      {fileName && (
                        <DonutChart data={{ 
                          labels: ['Low', 'Medium', 'High', 'Critical'], 
                          values: [lowC, mediumC, highC, criticalC], 
                          colors: ['#FFEE99', '#FF9F00', '#FF4500', '#E12901'] }} />

                      )}
                      <br />

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverC? 
                              <Box sx={{ fontWeight: 'bold' }}> Priority </Box>
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverC? 
                              "Low: " + lowC.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverC? 
                              "Medium: " + mediumC.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverC? 
                              "High: " + highC.toString() 
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverC? 
                              "Critical: " + criticalC.toString() 
                          : null} 
                      </Typography>

                      </CardContent>
                      </Link>
                  </CardActionArea>
                  
                  </Card>
             </Grid>


            {/*Forwarded tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
            
                <CardActionArea >
                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(forwardedData) } }}>
                  
                    <CardContent 
                          onMouseOver={() => setHoverF(true)}
                          onMouseOut={() => setHoverF(false)} >
                    <Typography gutterBottom variant="h5" component="div">
                        Forwarded tickets
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {forwarded}
                    </Typography>

                    {fileName && (
                       <DonutChart data={{ 
                        labels: ['Low', 'Medium', 'High', 'Critical'], 
                        values: [lowF, mediumF, highF, criticalF], 
                        colors: ['#FFEE99', '#FF9F00', '#FF4500', '#E12901'] }} />

                    )}
                    <br />

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverF? 
                              <Box sx={{ fontWeight: 'bold' }}> Priority </Box>
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverF? 
                              "Low: " + lowF.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverF? 
                              "Medium: " + mediumF.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverF? 
                              "High: " + highF.toString() 
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverF? 
                              "Critical: " + criticalF.toString() 
                          : null} 
                      </Typography>

                    </CardContent>
                    </Link>
                </CardActionArea>
                </Card>
            </Grid>


            {/*Reopened tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
            
                <CardActionArea >
                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(reopenedData) } }}>
                  <CardContent 
                          onMouseOver={() => setHoverReopened(true)}
                          onMouseOut={() => setHoverReopened(false)} >
                    <Typography gutterBottom variant="h5" component="div">
                        Reopened tickets
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {reopened}
                    </Typography>

                    {fileName && (
                       <DonutChart data={{ 
                        labels: ['Low', 'Medium', 'High', 'Critical'], 
                        values: [lowReopened, mediumReopened, highReopened, criticalReopened], 
                        colors: ['#FFEE99', '#FF9F00', '#FF4500', '#E12901'] }} />

                    )}
                    <br />

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              <Box sx={{ fontWeight: 'bold' }}> Priority </Box>
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "Low: " + lowReopened.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "Medium: " + mediumReopened.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "High: " + highReopened.toString() 
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "Critical: " + criticalReopened.toString() 
                          : null} 
                      </Typography>


                    </CardContent>
                    </Link>
                </CardActionArea>
                </Card>
            </Grid>

            {/*Más de dos semanas tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
            
                <CardActionArea >
                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(reopenedData) } }}>
                  <CardContent 
                          onMouseOver={() => setHoverReopened(true)}
                          onMouseOut={() => setHoverReopened(false)} >
                    <Typography gutterBottom variant="h5" component="div">
                        Más de dos semanas tickets
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {reopened}
                    </Typography>

                    {fileName && (
                       <DonutChart data={{ 
                        labels: ['Low', 'Medium', 'High', 'Critical'], 
                        values: [lowReopened, mediumReopened, highReopened, criticalReopened], 
                        colors: ['#FFEE99', '#FF9F00', '#FF4500', '#E12901'] }} />

                    )}
                    <br />

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              <Box sx={{ fontWeight: 'bold' }}> Priority </Box>
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "Low: " + lowReopened.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "Medium: " + mediumReopened.toString()
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "High: " + highReopened.toString() 
                          : null} 
                      </Typography>

                      <Typography variant="subtitle1" color="text.secondary">
                          {hoverReopened? 
                              "Critical: " + criticalReopened.toString() 
                          : null} 
                      </Typography>


                    </CardContent>
                    </Link>
                </CardActionArea>
                </Card>
            </Grid>


            {/*Backlog tickets*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
            
                <CardActionArea href="/">
                <CardContent 
                          onMouseOver={() => setHoverBacklog(true)}
                          onMouseOut={() => setHoverBacklog(false)} >
                    <Typography gutterBottom variant="h5" component="div">
                        Backlog
                    </Typography>
                    <br />
                    
                        {/* si hay backlog, o sea es true */}

                        {backlog && fileName? 
                              <DonutChart data={{ 
                                labels: ['Over limit'], 
                                values: [lowReopened], 
                                colors: ['#FF2400	'] }} /> 
                          : null
                          } 

                        {!backlog && fileName? 
                          <DonutChart data={{ 
                            labels: ['Below limit'], 
                            values: [lowReopened], 
                            colors: ['#32CD32	'] }} />
                          : null }

                        {/* si no hay, si es false */}

                       {/*  agregar un hover que enseñe tickets abiertos, assigned,
                        el limite de 5% y cuánto queda el backlog */}
                        <br />
                        <br />

                        <Typography variant="subtitle1" color="text.secondary">
                          {hoverBacklog? 
                              "Open tickets: " + openTickets.toString() 
                          : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                          {hoverBacklog? 
                              "Asigned tickets: " + assigned.toString() 
                          : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                          {hoverBacklog? 
                              "5% limit: " + restrictionTotal.toString() 
                          : null} 
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                          {hoverBacklog? 
                              "Backlog total: " + (Math.floor(backlogTotal)).toString() 
                          : null} 
                        </Typography>
  
                    </CardContent>
                    
                </CardActionArea>
                </Card>
            </Grid>



            {/*Graphics*/}
            <Grid item xs={3}>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
            
                <CardActionArea >
                <Link href={{ pathname: '/graficas', query: { data: JSON.stringify(allData) } }}>
                <CardContent >
                    <Typography gutterBottom variant="h5" component="div">
                        Graphics
                    </Typography>
                    
  
                    </CardContent>
                </Link>
                </CardActionArea>
                
                </Card>
            </Grid>

           
        </Grid>
        
        </Container>

    </Container>
    <br />
        
        
        </>
    );
}