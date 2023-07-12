//Imports
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as XLSX from "xlsx";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import DonutChart from '@/components/donutChart';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import html2canvas from 'html2canvas';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Home(props:any) {
  const [fileName, setFileName] = useState(null);

  const [isLoading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); 

  //Cards
  const [total, setTotal] = useState(0);
  const [solved, setSolved] = useState(0);
  const [closed, setClosed] = useState(0);
  const [forwarded, setForwarded] = useState(0);
  const [reopened, setReopened] = useState(0);

  //Inside card total
  const [low, setLow] = useState(0);
  const [medium, setMedium] = useState(0);
  const [high, setHigh] = useState(0);
  const [critical, setCritical] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [pending, setPending] = useState(0);
  const [resolved, setResolved] = useState(0);

  //Inside card resolved
  const [lowR, setLowR] = useState(0);
  const [mediumR, setMediumR] = useState(0);
  const [highR, setHighR] = useState(0);
  const [criticalR, setCriticalR] = useState(0);

  //Inside card closed
  const [lowC, setLowC] = useState(0);
  const [mediumC, setMediumC] = useState(0);
  const [highC, setHighC] = useState(0);
  const [criticalC, setCriticalC] = useState(0);

  //Inside card forwarded
  const [lowF, setLowF] = useState(0);
  const [mediumF, setMediumF] = useState(0);
  const [highF, setHighF] = useState(0);
  const [criticalF, setCriticalF] = useState(0);

  //Inside card reopened
  const [lowReopened, setLowReopened] = useState(0);
  const [mediumReopened, setMediumReopened] = useState(0);
  const [highReopened, setHighReopened] = useState(0);
  const [criticalReopened, setCriticalReopened] = useState(0);

  //Inside card 2 weeks
  const [count2weeks, setCount2weeks] = useState(0);
  const [openNotSolved, setOpenNotSolved] = useState(0);

  // data
  const [allData, setData] = useState<unknown[]>([]);
  const [resolvedData, setResolvedData] = useState<unknown[]>([]);
  const [closedData, setClosedData] = useState<unknown[]>([]);
  const [forwardedData, setForwardedData] = useState<unknown[]>([]);
  const [reopenedData, setReopenedData] = useState<unknown[]>([]);
  const [open2weeksData, setOpen2weeksData] = useState<unknown[]>([]);

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

  useEffect(() => {
    //Simulating data fetching delay
    setTimeout(() => {
      setLoading(false);
    }, 1500); 
  }, []);
  
  const handleFile = async (e:any) =>{
    
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);

    //First excel sheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    //Read as JSON
    let jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
    });

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      console.log('csv');
      jsonData = jsonData.slice(1);
    } else {
      console.log('other');
    }

    const moment = require('moment-timezone')

    console.log("data", jsonData);

    //Format dates
    const formattedData = jsonData.slice(1).map(row => {

      for (let i = 8; i <= 10; i++) {
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
    
    //Tickets open more than 2 weeks
    let cont2weeks = 0;
    let contOpenNotSolved = 0;

    const filteredRows = jsonData.filter(row => {
      let column = row as unknown[];

      //Column open, column solved and column duration in days
      if (column[13] === "1" && column[14] === "0" && column[37] > 14) {
        cont2weeks++;
        return true;
      }

      if (column[13] === "1" && column[14] === "0") {
        contOpenNotSolved++;
        return true;
      }
      
      return false;
    });
    setCount2weeks(cont2weeks);
    setOpenNotSolved(contOpenNotSolved);


    //set data
    setData(jsonData);

    //total tickets
    let counter = 0;
    for (var item of jsonData){
      counter++;
    }
    setTotal(counter-1);

    //Counters 
    let contadorSolved = 0;
    let contadorClosed = 0;
    let contadorForwarded = 0;
    let contadorReopened = 0;

    //General counters
    let contadorLow = 0;
    let contadorMedium = 0;
    let contadorHigh = 0;
    let contadorCritical = 0;

    //Counters card total
    let contadorAssigned = 0;
    let contadorInProgress = 0;
    let contadorPending = 0;
    let contadorResolved = 0;

    //Counters card resolved
    let contadorLowR = 0;
    let contadorMediumR = 0;
    let contadorHighR = 0;
    let contadorCriticalR = 0;

    //Counters card closed
    let contadorLowC = 0;
    let contadorMediumC = 0;
    let contadorHighC = 0;
    let contadorCriticalC = 0;

    //Counters card forwarded
    let contadorLowF = 0;
    let contadorMediumF = 0;
    let contadorHighF = 0;
    let contadorCriticalF = 0;

    //Counters card reopened
    let contadorLowReopened = 0;
    let contadorMediumReopened  = 0;
    let contadorHighReopened  = 0;
    let contadorCriticalReopened  = 0;

    let contadorOpenedTickets = 0;

    let arrayResolved=[];
    let arrayClosed=[];
    let arrayForwarded=[];
    let arrayReopened=[];
    let arrayOpen2Weeks=[];
    arrayResolved.push(jsonData[0]);
    arrayClosed.push(jsonData[0]);
    arrayForwarded.push(jsonData[0]);
    arrayReopened.push(jsonData[0]);
    arrayOpen2Weeks.push(jsonData[0]);

    for (let i = 1; i < jsonData.length; i++){

      let row = jsonData[i] as unknown[];

      //Backlog
      if(row[13] == "1"){
        contadorOpenedTickets++;
      }

      //Total tickets 
      if (row[6] == "Low"){
        contadorLow++;
      }

      if (row[6] == "Medium"){
        contadorMedium++;
      }

      if (row[6] == "High"){
        contadorHigh++;
      }

      if (row[6] == "Critical"){
        contadorCritical++;
      }


      //Assigned
      if (row[7] === "Assigned"){
        contadorAssigned++;
      }

      //In progress
      if (row[7] === "In Progress"){
        contadorInProgress++;
      }

      //Pending
      if (row[7] === "Pending"){
        contadorPending++;
      }

      //Solved
      if (row[14] === "1"){ //solved
        contadorSolved++;
      }

      //Resolved
      if (row[7] === "Resolved" ){ 
        contadorResolved++;
        arrayResolved.push(jsonData[i]);

        if (row[6] == "Low"){
          contadorLowR++;
        }
  
        if (row[6] == "Medium"){
          contadorMediumR++;
        }
  
        if (row[6] == "High"){
          contadorHighR++;
        }
  
        if (row[6] == "Critical"){
          contadorCriticalR++;
        }
        
      }

      //Closed
      if (row[7] === "Closed"){
        contadorClosed++;
        arrayClosed.push(jsonData[i]);

        if (row[6] == "Low"){
          contadorLowC++;
        }
  
        if (row[6] == "Medium"){
          contadorMediumC++;
        }
  
        if (row[6] == "High"){
          contadorHighC++;
        }
  
        if (row[6] == "Critical"){
          contadorCriticalC++;
        }
      }


      //Forwarded
      if (row[16] === "1"){
        contadorForwarded++;
        arrayForwarded.push(jsonData[i]);

        if (row[6] == "Low"){
          contadorLowF++;
        }
  
        if (row[6] == "Medium"){
          contadorMediumF++;
        }
  
        if (row[6] == "High"){
          contadorHighF++;
        }
  
        if (row[6] == "Critical"){
          contadorCriticalF++;
        }
      }

      //Reoponed
      if (row[15] === "1"){
        contadorReopened++;
        arrayReopened.push(jsonData[i]);

        if (row[6] == "Low"){
          contadorLowReopened++;
        }
  
        if (row[6] == "Medium"){
          contadorMediumReopened++;
        }
  
        if (row[6] == "High"){
          contadorHighReopened++;
        }
  
        if (row[6] == "Critical"){
          contadorCriticalReopened++;
        }
      }

      //Tickets open more than 2 weeks
      if (row[13] === "1" && row[14] === "0" && row[37] > 14) {
        arrayOpen2Weeks.push(jsonData[i]);
      }
      
    }

    //General setters
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
    setOpen2weeksData(arrayOpen2Weeks);

    //Backlog: how many were opened vs how many were assinged. This number should not exceed more than 5% of month total.
    let restriction = (counter-1) * 0.5;

    if (((contadorOpenedTickets/contadorAssigned)*100) > restriction){
      setBacklog(true);
    }

    setRestrictionTotal(restriction);

    setBacklogTotal(((contadorOpenedTickets/contadorAssigned)*100));
  
  }

  //Style loading
  if (isLoading) {
    return <div 
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontWeight: 600,
      fontSize: '2rem',
      fontFamily: 'Arial, Helvetica, sans-serif',
    }}> 
      Loading...
    </div>;
  }

  //Bosch secondary colors
  const newColors = ['#ffed1a', '#fa9b00', '#009be1', '#FF0000']; 

  //Create PDF
  const handleDownloadPdf = async (elementIds: string[]) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      let currentPage = 1;
  
      for (let i = 0; i < elementIds.length; i++) {
        const elementId = elementIds[i];
        const cardElement = document.getElementById(elementId);

        if (cardElement !== null) {

          try {

            setHover(true);
            setHoverR(true);
            setHoverC(true);
            setHoverF(true);
            setHoverReopened(true);
            setHoverBacklog(true);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            const canvas = await html2canvas(cardElement, { scrollX: -window.scrollX -100 , scrollY: -window.scrollY-100000 });
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            if (i > 0) {
              pdf.addPage();
            }
    
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            setShowSuccessAlert(true);
          } catch (error) {
            console.error('Error generating image:', error);
          }
        }
      }
  
      pdf.save('MainPage.pdf');
      setHover(false);
      setHoverR(false);
      setHoverC(false);
      setHoverF(false);
      setHoverReopened(false);
      setHoverBacklog(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };
  

    return( 
        <>
        <Container id= "all-data" maxWidth="xl">
          <br />

          {/* Success alert */}
          {showSuccessAlert && (
            <Box position="absolute" top={20} right={20} sx={{width: 300}}>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                PDF Generated Successfully
              </Alert>
            </Box>
          )}

          <Container id="title-and-bar">
            <Box id="title" display="flex" justifyContent="center" alignItems="center">
              <Typography variant='h3' align='center' mt={2} sx={{fontWeight:400}}>Tickets</Typography>
            </Box>

            <Box id="bar" width="95%" sx={{ backgroundColor: "#EB1C24", height: 10, mt:3, marginLeft: "auto", marginRight: "auto" }}></Box>

            <br /> 

            {/* Select and download buttons */}
            <Stack direction="row" spacing={2} width={"100%"} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', mt:1, mb:2}}>
              <input id="select-button" type="file"  accept=".xlsx, .xls, .csv" style={{ display: 'none' }} onChange={handleFile}></input>
                  <label htmlFor="select-button">
                      <Button variant="contained" component="span"
                        style={{
                          backgroundColor: "#4D4D52",
                          padding: "18px 36px"
                        }}
                        endIcon={<FileOpenIcon />}>
                        Select a file
                      </Button>
                    </label>

              {fileName && (
                <Tooltip title="Download Main Page as PDF" arrow>
                  <Button variant="contained" component="span"
                          style={{
                            backgroundColor: "#4D4D52",
                            padding: "18px 36px"
                          }}
                          onClick={() => handleDownloadPdf(["all-data"])}
                          endIcon={<DownloadIcon />}>
                          Download
                        </Button>
                </Tooltip>
              ) }

            </Stack>
     
            <div className='center'>
                {fileName && (
                  <Typography variant="h4" align="center" mt={3} mb={3} >File Name: <span>{fileName}</span></Typography>
                ) }
                
            </div>

            <br></br>
          </Container>

          <Container maxWidth="lg" sx={{mt:1}}>

            {/* Cards */}
            <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 1, pb: 1 }}>
                
              <Grid container spacing={4} alignItems="center" justifyContent="center">
                  
                  <Grid id="cards1" container spacing={4} alignItems="center" justifyContent="center">
                 
                    {/* Total de tickets*/}
                    <Grid item xs={3} >
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See all tickets </Typography>}  placement="top" arrow>

                        <Card  sx={{ maxWidth: 300, minHeight: 300, backgroundColor:'white' }}  >
                      
                          <CardActionArea >
                              <CardContent 
                                  onMouseOver={() => setHover(true)}
                                  onMouseOut={() => setHover(false)} >

                                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(allData) } }}>
                            
                                <Typography gutterBottom variant="h5" component="div">
                                    Total tickets    
                                </Typography>
                                </Link>

                                <Typography variant="h6" color="text.secondary">
                                    <Box sx={{ fontWeight: 'bold' }}> {total} </Box>
                                </Typography>


                                {fileName && (
                                  <DonutChart data={{ 
                                    labels: ['Resolved', 'Closed', 'Forwarded', 'Reopened'], 
                                    values: [solved, closed, forwarded, reopened], 
                                    colors: newColors }} />

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
                    
                          </CardActionArea>
                          
                        </Card>
                      </Tooltip>
                    </Grid>

                    {/*Resolved tickets*/}
                    <Grid item xs={3}>
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See Resolved Tickets</Typography>}  placement="top" arrow>

                          <Card id="card2" sx={{ maxWidth: 300, minHeight: 300 }}  >

                          <CardActionArea >
                          
                            <CardContent 
                                  onMouseOver={() => setHoverR(true)}
                                  onMouseOut={() => setHoverR(false)} >
                              
                              <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(resolvedData) } }}> 
                                <Typography gutterBottom variant="h5" component="div">
                                    Resolved tickets
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {resolved}
                                </Typography>
                              </Link>


                              {fileName && (
                                <DonutChart data={{ 
                                  labels: ['Low', 'Medium', 'High', 'Critical'], 
                                  values: [lowR, mediumR, highR, criticalR], 
                                  colors: newColors }} />

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
                          </CardActionArea>
                          
                          </Card>
                      </Tooltip>

                    </Grid>

                    {/*Closed tickets*/}
                    <Grid item xs={3}>
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See Closed Tickets</Typography>}  placement="top" arrow>

                        <Card sx={{ maxWidth: 300, minHeight: 300 }}  >
                        
                            <CardActionArea >
                              <CardContent 
                                      onMouseOver={() => setHoverC(true)}
                                      onMouseOut={() => setHoverC(false)} >
                                
                                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(closedData) } }}>
                                  <Typography gutterBottom variant="h5" component="div">
                                      Closed tickets
                                  </Typography>
                                  <Typography variant="h6" color="text.secondary">
                                      {closed}
                                  </Typography>
                                </Link>


                                {fileName && (
                                  <DonutChart data={{ 
                                    labels: ['Low', 'Medium', 'High', 'Critical'], 
                                    values: [lowC, mediumC, highC, criticalC], 
                                    colors: newColors }} />

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
                            </CardActionArea>
                            
                        </Card>
                      </Tooltip>

                    </Grid>

                    {/*Forwarded tickets*/}
                    <Grid item xs={3}>
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See Forwarded Tickets</Typography>}  placement="top" arrow>
                        <Card sx={{ maxWidth: 300, minHeight: 300 }}  >
                            <CardActionArea >
                                <CardContent 
                                      onMouseOver={() => setHoverF(true)}
                                      onMouseOut={() => setHoverF(false)} >
                                
                                <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(forwardedData) } }}>
                                  <Typography gutterBottom variant="h5" component="div">
                                      Forwarded tickets
                                  </Typography>
                                  <Typography variant="h6" color="text.secondary">
                                      {forwarded}
                                  </Typography>
                                </Link>

                                {fileName && (
                                  <DonutChart data={{ 
                                    labels: ['Low', 'Medium', 'High', 'Critical'], 
                                    values: [lowF, mediumF, highF, criticalF], 
                                    colors: newColors }} />

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
                            </CardActionArea>
                        </Card>
                      </Tooltip>

                    </Grid>
                  
                    {/*Reopened tickets*/}
                    <Grid item xs={3}>
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See Reopened Tickets</Typography>}  placement="top" arrow>

                        <Card sx={{ maxWidth: 300, minHeight: 380 }}  >
                      
                          <CardActionArea >
                            <CardContent 
                                    onMouseOver={() => setHoverReopened(true)}
                                    onMouseOut={() => setHoverReopened(false)} >
                              
                              <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(reopenedData) } }}>

                                <Typography gutterBottom variant="h5" component="div">
                                    Reopened tickets
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {reopened}
                                </Typography>
                              </Link>

                              {fileName && (
                                <DonutChart data={{ 
                                  labels: ['Low', 'Medium', 'High', 'Critical'], 
                                  values: [lowReopened, mediumReopened, highReopened, criticalReopened], 
                                  colors: newColors }} />

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
                          </CardActionArea>
                        </Card>
                      </Tooltip>

                    </Grid>

                    {/*Más de dos semanas tickets*/}
                    <Grid item xs={3}>
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See Tickets Open More Than Two Weeks</Typography>}  placement="top" arrow>
                        <Card sx={{ maxWidth: 300, minHeight: 380 }}  >
                        
                            <CardActionArea >
                              <CardContent 
                                      /* onMouseOver={() => setHoverReopened(true)}
                                      onMouseOut={() => setHoverReopened(false)} */ >
                              <Link href={{ pathname: '/tickets', query: { data: JSON.stringify(open2weeksData) } }}>

                                  <Typography gutterBottom variant="h5" component="div">
                                      Open tickets more than 2 weeks
                                  </Typography>
                                  <Typography variant="h6" color="text.secondary">
                                      {count2weeks}
                                  </Typography>
                                </Link>


                                {fileName && (
                                  <DonutChart data={{ 
                                    labels: ['Total tickets', 'Open and not solved', 'Open more than 2 weeks'], 
                                    values: [total, openNotSolved, count2weeks], 
                                    colors: newColors }} />

                                )}

                                </CardContent>
                            </CardActionArea>
                        </Card>
                      </Tooltip>
                    </Grid>


                    {/*Backlog tickets*/}
                    <Grid item xs={3}>
                      
                      <Card sx={{ maxWidth: 300, minHeight: 380 }}  >
                    
                        <CardActionArea>
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
                                        colors: ['#e10a14	'] }} /> 
                                  : null
                                  } 

                                {!backlog && fileName? 
                                  <DonutChart data={{ 
                                    labels: ['Below limit'], 
                                    values: [lowReopened], 
                                    colors: ['#d7e100	'] }} />
                                  : null }

                                {/* si no hay, si es false */}

                                <br />
                                <br />

                                <Typography variant="subtitle1" color="text.secondary">
                                  {hoverBacklog? 
                                      "Open tickets: " + openTickets.toString() 
                                  : null} 
                                </Typography>

                                <Typography variant="subtitle1" color="text.secondary">
                                  {hoverBacklog? 
                                      "Assigned tickets: " + assigned.toString() 
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
                      <Tooltip title= { <Typography gutterBottom variant="subtitle2" component="div"> See Graphics</Typography>}  placement="top" arrow>

                        <Card sx={{ maxWidth: 300, minHeight: 380, backgroundColor:'white' }}  >
                      
                          <CardActionArea >
                          <Link href={{ pathname: '/graficas', query: { data: JSON.stringify(allData) } }}>
                          <CardContent >
                              <Typography gutterBottom variant="h5" component="div">
                                  Graphics
                              </Typography>

                              {fileName && (
                                <div style={{ whiteSpace: 'pre-line' }}>
                                  <Typography variant="subtitle1" color="text.secondary"> 
                                    View all graphics
                                  </Typography> 

                                </div>

                              )}
                              </CardContent>
                          </Link>
                          </CardActionArea>
                          
                        </Card>
                      </Tooltip>

                    </Grid>
                  </Grid>

              </Grid>
          
            </Container>

          </Container>

        </Container>
        <br />
        
        </>
    );
}