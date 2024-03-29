//Imports
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import BarChart from '../components/barChart';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import StackedBarChart from '@/components/stackedBarChart';
import PieChart from '@/components/pieChart';
import html2canvas from 'html2canvas'; 
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import DonutChart from '@/components/donutChart';
import domtoimage from 'dom-to-image';
import { MoreVert as MoreVertIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//Interfaces
interface Service {
    type: string;
}

interface Asignee {
  type: string;
}

interface SupportGroup {
  type: string;
}

interface Category {
  type: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow:'scroll',
    display:'block',
    maxHeight: '80vh', 
    overflowY: 'scroll',

};

export default function Graficas() {
    const router = useRouter();
    const { data } = router.query;
    const allData = JSON.parse(data);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false); 

    //asignee names modal
    const [openAssignee, setOpenAssignee] = useState(false);
    const handleOpenAssignee = () => setOpenAssignee(true);
    const handleCloseAssignee = () => setOpenAssignee(false);

    //tickets by service bar chart modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //forwared groups modal
    const [openGroups, setOpenGroups] = useState(false);
    const handleOpenGroups = () => setOpenGroups(true);
    const handleCloseGroups = () => setOpenGroups(false);

    // Create array of services
    const services2 = Array.from(new Set(allData.slice(1).map((row:any) => row[2] ? row[2] : null)))

    const services: Service[] = services2.map(type => ({ type }));

    // Count services
    const countServices = (services: Service[], data: any[]) => {
    return services.reduce((counts, service) => {
        const type = service.type;
        counts[type] = data.filter(row => row[2] === type).length;
        return counts;
    }, {} as Record<string, number>);
    };
    const serviceCounts = countServices(services, allData);

    // Sort services in descending order 
    const sortedServices = Object.entries(serviceCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .reduce((sortedObj, [type, count]) => {
      sortedObj[type] = count;
      return sortedObj;
    }, {} as Record<string, number>);

    // Get top 10 services
    const topServices = Object.entries(serviceCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10)
    .map(([type, count]) => ({ type, count }));

    // Create array of OMCS assignee names
    const assigneeName = Array.from(new Set(allData.slice(1).map((row:any) => {
      if (row[4] === "Order Management Customizing and Services") {
        return row[18] ? row[18] : null;
      }
    })));
    
    // Sort names in ascending order
    const assigneeNames: Asignee[] = assigneeName.map(type => ({ type: type as string })).sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    });

    // Count OMCS assigne names
    const countAsigneeNamesAll = (assigneeNames: Asignee[], data: any[]) => {
    return assigneeNames.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(row => row[18] === type && row[4] === "Order Management Customizing and Services").length;
        return counts;
    }, {} as Record<string, number>);
    };

    const asigneeNameCountsAll = countAsigneeNamesAll(assigneeNames, allData);

    // Count total sum of tickets handled by team
    const countTeamAll = (assigneeNames: Asignee[], data:any[]) => {
      const counts = assigneeNames.reduce((counts, name) => {
        const type = name.type; 
        counts[type] = data.filter(row => row[18] === type && row[4] === "Order Management Customizing and Services").length;
        return counts;
      }, {} as Record<string, number>);
    
      const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      return {
        totalCount
      };
    };
    
    const countTeam = countTeamAll(assigneeNames, allData);
    const totalCount = countTeam.totalCount;

    const countAsigneeNames = (assigneeNames: Asignee[], data: any[]) => {
      const counts = assigneeNames.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(row => row[18] === type && row[4] === "Order Management Customizing and Services").length;
        return counts;
      }, {} as Record<string, number>);
      const entries = Object.entries(counts);
      const sortedEntries = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
      return Object.fromEntries(sortedEntries);
    };
    
    const asigneeNameCounts = countAsigneeNames(assigneeNames, allData);

    // Create an array of the top 10 names with highest counts
    const topNames = Object.entries(asigneeNameCounts)
    .sort(([, countA], [, countB]) => countB - countA) //sort by count in descending order
    .slice(0, 10) // take only the top 10 names
    .map(([name]) => name); // extract the names only

    // Create an array of the counts corresponding to the top names
    const topCounts = topNames.map(name => asigneeNameCounts[name]);
    
    // Data for pie chart tickets handled by team
    const dataPie = {
    labels: topNames,
    values: topCounts,
    colors:  assigneeNames.slice(0, 10).map(() => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const a = Math.random();
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }), 
    };

    // Bar chart team tickets category
    const countCategoryTeam = (allData:any) => {

      const teamData = allData.filter((row: string[]) => row[4] === "Order Management Customizing and Services");
      const requestCountTeam = teamData.filter((row: string[]) => row[19] === "Request").length;
      const failureCountTeam = teamData.filter((row: string[]) => row[19] === "Failure").length;
     
          return {
            Request: requestCountTeam,
            Failure: failureCountTeam
        };
    };
        
    const teamCategoryCount = countCategoryTeam(allData);   

    // Create array of groups to be forwarded
    const forwardedToGroup = Array.from(
      new Set(
        allData.slice(1).map((row: any) => {
          if (
            row[4] === "Order Management Customizing and Services" &&
            row[16] === "1"
          ) {
            return row[33] ? row[33] : null;
          }
        })
      )
    );
    
    // Sort groups
    const forwardedToGroups: SupportGroup[] = forwardedToGroup
      .map((type) => ({ type: type as string }))
      .sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
    });

    // Count forwarded tickets
    const countForwardedToGroups = (forwardedToGroups: SupportGroup[], data: any[]) => {
      return forwardedToGroups.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(
          (row) =>
            row[33] === type &&
            row[4] === "Order Management Customizing and Services" &&
            row[16] === "1"
        ).length;
        return counts;
      }, {} as Record<string, number>);
    };

    const countAllForwardedToGropus = countForwardedToGroups(forwardedToGroups, allData);

    // Remove first 7 characters of each name
    const modifiedCounts: Record<string, number> = {};
    for (const [name, count] of Object.entries(countAllForwardedToGropus)) {
      const modifiedName = name.substring(7, name.length - 1);
      modifiedCounts[modifiedName] = count;
    }

    // Find the top 10 names with the greatest counts
    const sortedNames = Object.entries(modifiedCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Get groups and counts in descending order
    const sortedNamesAll: Record<string, number> = Object.entries(modifiedCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj: Record<string, number>, [groupName, count]) => {
        obj[groupName] = count;
        return obj;
    }, {});

     // Priority and status stacked bar chart 
     const countByStatusAndPriority = (data:any) => {
      const counts: Record<string, number> = {};
      data.forEach((row: any[]) => {
        const status = row[7];
        const priority = row[6];
        
        if (status && priority) {
          const key = `${status}-${priority}`;
          counts[key] = (counts[key] || 0) + 1;
        }
      });
      return counts;
    };

    // Transform data into graph format
    const transformData = (counts: any) => {
      const labels = ['Assigned', 'Closed', 'In Progress', 'Pending', 'Resolved'];
      const priorities = ['High', 'Medium', 'Low'];
      const datasets = priorities.map((priority) => {
        return {
          label: priority,
          values: labels.map((status) => counts[`${status}-${priority}`] || 0),
          colors: `rgba(${Math.floor(Math.random() * 256)}, 
                      ${Math.floor(Math.random() * 256)}, 
                      ${Math.floor(Math.random() * 256)})`,
        };
      }).reverse();
      return { labels, datasets };
    };

    const statusPriorityCounts = countByStatusAndPriority(allData);
    const transformedData = transformData(statusPriorityCounts);

    // Bar chart assigned, resolved and forwarded
    const countRows = (allData:any) => {
      const assignedCount = allData.filter((row: string[]) => row[7] === "Assigned").length;
      const resolvedCount = allData.filter((row: string[]) => row[7] === "Resolved").length;
      const row16Count = allData.filter((row: string[]) => row[16] === "1").length;
    
      return {
        Assigned: assignedCount,
        Resolved: resolvedCount,
        Forwarded: row16Count
      };
    };
    
    const rowCounts = countRows(allData);    

    // Bar chart request, failure, reopened,complaints
    const countFailures = (allData:any) => {
      const requestCount = allData.filter((row: string[]) => row[19] === "Request").length;
      const failureCount = allData.filter((row: string[]) => row[19] === "Failure").length; 
      const reopenedCount = allData.filter((row: string[]) => row[15] === "1").length;
      const complaintsCount = allData.filter((row: string[]) => row[5] === "Complaint").length;

      return {
        Request: requestCount,
        Failure: failureCount,
        Reopened: reopenedCount,
        Complaints: complaintsCount,
      };
    };
    
    const failuresCount = countFailures(allData);    

    
    // Bar chart team by status
    const countStatusTeam = (allData:any) => {
      const teamData = allData.filter((row: string[]) => row[4] === "Order Management Customizing and Services");

      const assignedCountTeam = teamData.filter((row: string[]) => row[7] === "Assigned").length;
      const closedCountTeam = teamData.filter((row: string[]) => row[7] === "Closed").length;
      const inProgressCountTeam = teamData.filter((row: string[]) => row[7] === "In Progress").length;
      const pendingCountTeam = teamData.filter((row: string[]) => row[7] === "Pending").length;
      const resolvedCountTeam = teamData.filter((row: string[]) => row[7] === "Resolved").length;
      const forwardedCountTeam = teamData.filter((row: string[]) => row[16] === "1").length;
      const reopenedCountTeam = teamData.filter((row: string[]) => row[15] === "1").length;

          return {
            Assigned: assignedCountTeam,
            Closed: closedCountTeam,
            In_Progress: inProgressCountTeam,
            Pending: pendingCountTeam,
            Resolved: resolvedCountTeam,
            Forwarded: forwardedCountTeam,
            Reopened: reopenedCountTeam
        };
    };
        
    const teamStatusCount = countStatusTeam(allData);   

    // Download graphs as image
    const handleDownloadImage = (elementId:any) => {
      const chartContainer = document.getElementById(elementId); // Get the chart container element

      if (chartContainer){
        const containerStyle = chartContainer.style.boxShadow; // Store the original box shadow
        
        if (containerStyle !== 'none') {
          chartContainer.style.boxShadow = 'none'; // Remove the box shadow 
        }

        //chartContainer.style.boxShadow = 'none'; // Remove the box shadow temporarily
        html2canvas(chartContainer, { useCORS: true }).then((canvas) => {
          const image = canvas.toDataURL('image/png'); // Convert canvas to image data URL
          const downloadLink = document.createElement('a'); // Create a download link element
          downloadLink.href = image; // Set the image data URL as the link's href
          downloadLink.download = 'graph.png'; // Set the download filename
          downloadLink.click(); // Trigger the download
        });
      }
    };

    // Download all graphs as PDF
    const handleDownloadPdf = async (elementIds: string[]) => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
    
        for (let i = 0; i < elementIds.length; i++) {
          const elementId = elementIds[i];
          const chartContainer = document.getElementById(elementId);
    
          const options = {
            style: {
              'transform-origin': 'center',
            },
            quality: 1,
          };
    
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const dataUrl = await domtoimage.toPng(chartContainer, options);
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
            if (i > 0) {
              pdf.addPage();
            }
    
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            setShowSuccessAlert(true);
          } catch (error) {
            console.error('Error generating image:', error);
          }
        }
    
        pdf.save('graphs.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
      setTimeout(() => {
      setShowSuccessAlert(false);
      }, 3000);
    };

    // Generate random colors
    const generateRandomColors = (count: number) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        const color = `rgb(${r}, ${g}, ${b})`;
        colors.push(color);
      }
      return colors;
    };


  return(
    <>
    <Container id="all-data" sx={{height: '100%'}}>

      {showSuccessAlert && (
            <Box position="absolute" top={20} right={20} sx={{width: 300}}>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                PDF Generated Successfully
              </Alert>
            </Box>
      )}
      <Container id="title-and-chart">
      
      {/* Back button */}
      <Box position="absolute" top={30} left={50} sx={{ width: 300 }}>
        <Button
          variant="outlined"
          component="span"
          style={{
            color: "#4D4D52",
            padding: "9px 18px",
            borderColor: "#4D4D52", 
          }}
          onClick={() => {
            window.location.href = "/"; 
          }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </Box>


      <Typography variant='h3' align='center' mt={2} sx={{fontWeight:400}}>Graphics</Typography>

      <Box width="95%" sx={{ backgroundColor: "#EB1C24", height: 10, mt:3, marginLeft: "auto", marginRight: "auto" }}></Box>        
      
      <Box id="title" display="flex" justifyContent="center" alignItems="center" sx={{mt:3}}>
          <Tooltip title="Download all graphics as PDF" arrow>
            <Button variant="contained" component="span"
                    style={{
                      backgroundColor: "#4D4D52",
                      padding: "18px 36px"
                    }}
                    onClick={() => handleDownloadPdf(["title-and-chart", "charts2", "charts3", "charts4", "charts5"])}
                    endIcon={<DownloadIcon />}>
                    Download
                  </Button>
          </Tooltip>
        </Box>
      
        <br />

       {/*  Number of tickets by Service */}
        <Box id="chart-container1" display="flex" width={"100%"} justifyContent="center" alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white" }}>
          <Box display="flex" m={2} flexDirection="row" width="100%" alignItems="center" sx={{  backgroundColor: "white" }}>
            <Box display="flex" flexDirection="column" width="100%" alignItems="center">
              <br />
              {/* Download as png */}
              <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "-20px", marginRight: "-93%", cursor: "pointer" }}>
                <Tooltip title="Click to download graph image" arrow>
                  <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container1')}></Button>
                </Tooltip>
              </Box>
              <Typography align='center' variant='h6' sx={{ fontWeight: 'bold' }}>Number of tickets by Service</Typography>

              <br />
              <Button variant="text" onClick={handleOpen}>
                See Details
              </Button>
              <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        
                        <Typography id="modal-modal-title" align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Number of tickets by Service Details </Typography>
                                {Object.entries(sortedServices).map(([serviceName, count]) => (
                                    <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                                        {serviceName}: {" "}
                                        <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "12px" }}>
                                            {count}
                                        </Typography>
                                        <Typography> </Typography>
                                    </Typography>
                                ))}
                        </Box>
              </Modal>
              
              <Box display="flex" width="100%" alignItems="center" justifyContent="center" sx={{ borderRadius: '6px', backgroundColor: "white" }}>

              <BarChart data={{ 
                   labels: topServices.map(service => service.type),
                   values: topServices.map(service => service.count),
                   colors: topServices.map(() => {
                            const r = Math.floor(Math.random() * 255);
                            const g = Math.floor(Math.random() * 255);
                            const b = Math.floor(Math.random() * 255);
                            return `rgb(${r}, ${g}, ${b})`;
                            })
               }} />
                      
              </Box>

            </Box>
          </Box>
        </Box>
      </Container>

      <Container id="charts2">
        
        {/* Tickets by status and priority, tickets category and assigned, resolved*/}
        <Box  display="flex" width={"100%"} justifyContent="center" alignItems="stretch" sx={{ flexGrow: 1, height: '100%' }}>
          
          <Box id= "chart-container2" width="50%" m={2} alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-50px", marginBottom: "-5px", marginRight: "-85%", cursor: "pointer" }}>
                <Tooltip title= "Click to download graph image" arrow>
                  <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container2')}></Button>
                </Tooltip>
            </Box>
            <Typography align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Tickets by Status and Priority </Typography>
            <br />
            <StackedBarChart data={transformedData} />
          </Box>

          <Box  width="50%" m={2} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {/* Tickets request, failure, reopened, complaints*/}
              <Box  display="flex" width={"100%"} justifyContent="center" alignItems="stretch" sx={{height: '100%'}}>

                <Box id= "chart-container8" width="100%" mb={2} alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" , height: '100%'}}>
                    <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-5px", marginBottom: "-20px", marginRight: "-85%", cursor: "pointer" }}>
                        <Tooltip title= "Click to download graph image" arrow>
                          <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container8')}></Button>
                        </Tooltip>
                    </Box>
                    <br />
                    <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Request, Failure, Reopened, and Complaints </Typography> 

                    <br /> 
                    <BarChart
                      data={{
                        labels: Object.keys(failuresCount).filter(type => failuresCount[type] !== 0),
                        values: Object.values(failuresCount).filter(count => count !== 0),
                        colors: Object.keys(failuresCount).map(() => {
                          const r = Math.floor(Math.random() * 255);
                          const g = Math.floor(Math.random() * 255);
                          const b = Math.floor(Math.random() * 255);
                          return `rgb(${r}, ${g}, ${b})`;
                        })
                      }}
                    />
                </Box>

            </Box>

            <br />
            
            <Box id="chart-container4" width="100%" alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <br />
              <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "-5px", marginRight: "-85%", cursor: "pointer" }}>
                  <Tooltip title= "Click to download graph image" arrow>
                    <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container4')}></Button>
                  </Tooltip>
              </Box>
              <Typography align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Tickets Assigned, Resolved, and Forwarded</Typography>
              <BarChart
                data={{
                  labels: Object.keys(rowCounts).filter(type => rowCounts[type] !== 0),
                  values: Object.values(rowCounts).filter(count => count !== 0),
                  colors: Object.keys(rowCounts).map(() => {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    return `rgb(${r}, ${g}, ${b})`;
                  })
                }}
              />
              
            </Box>
            
          </Box>

        </Box>
      
      </Container>

      <Container id="charts3">
         {/* Tickets forwarded */}
         <Box display="flex" width={"100%"} justifyContent="center" alignItems="center">
            <Box id= "chart-container7" display="flex" m={2} flexDirection="row" width="100%"  alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white" }} >
                <Box display="flex" flexDirection="column" width="100%"  alignItems="center">
                    <br />
                    <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "-20px", marginRight: "-93%", cursor: "pointer" }}>
                      <Tooltip title= "Click to download graph image" arrow>
                        <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container7')}></Button>
                      </Tooltip>
                    </Box>
                    <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Forwarded Tickets </Typography>

                    <br />
                    <Button variant="text" onClick={handleOpenGroups}>See Details</Button>
                    <Modal
                        open={openGroups}
                        onClose={handleCloseGroups}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        
                        <Typography id="modal-modal-title" align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Tickets forwarded from Team to Other Groups </Typography>
                                {Object.entries(sortedNamesAll).map(([groupName, count]) => (
                                    <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                                        {groupName}: {" "}
                                        <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "12px" }}>
                                            {count}
                                        </Typography>
                                        <Typography> </Typography>
                                    </Typography>
                                ))}
                                
                        </Box>
                    </Modal>

                    <Box display="flex" width="100%" alignItems="center" justifyContent="center">

                        <BarChart data={{ 
                            labels: sortedNames.map(([name]) => name),
                            values: sortedNames.map(([, count]) => count),
                            colors: sortedNames.map(() => {
                              const r = Math.floor(Math.random() * 255);
                              const g = Math.floor(Math.random() * 255);
                              const b = Math.floor(Math.random() * 255);
                              return `rgb(${r}, ${g}, ${b})`;
                            })
                        }} />
                      
                    </Box>
                </Box>

            </Box>
          
        </Box>

      </Container>


      <Container id="charts4">
        <Box width="95%" sx={{ backgroundColor: "#EB1C24", height: 10, mt:6, marginLeft: "auto", marginRight: "auto" }}></Box>
        <Typography variant='h4' align='center' mt={3} mb={3} sx={{fontWeight:400}}>Order Management Graphics</Typography>
        
         {/* Tickets support group and team */}
         <Box  display="flex" width={"100%"} justifyContent="center" alignItems="stretch" sx={{height: '100%'}}>

          <Box id= "chart-container5" width="50%"  m={2} alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" , height: '100%'}}>
              <br />
              <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "-20px", marginRight: "-85%", cursor: "pointer" }}>
                  <Tooltip title= "Click to download graph image" arrow>
                    <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container5')}></Button>
                  </Tooltip>
              </Box>
              <br />
              <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets handled </Typography> 
              <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> by Support Group </Typography> 

              <br /> 
              <DonutChart data={{ 
                        labels: ['Order Management Customizing and Services', 'Others'], 
                        values: [totalCount, (allData.length - totalCount - 1)], 
                        colors: generateRandomColors(2) }} />
              <br />
              <br />
          </Box>

          <Box id="chart-container6" width="50%"  m={2} alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"  }}>
            <br />
            <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "1px", marginRight: "-85%", cursor: "pointer" }}>
                  <Tooltip title= "Click to download graph image" arrow>
                    <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container6')}></Button>
                  </Tooltip>
            </Box>
            <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets handled by Order Management Customizing and Services </Typography> 
            <Box display="flex" flexDirection="column" width="100%"  alignItems="center">
              <Button variant="text" onClick={handleOpenAssignee}>See Details</Button>
                <Modal
                  open={openAssignee}
                  onClose={handleCloseAssignee}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title2" align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Tickets handled by Team </Typography>
                    <br />
                        <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "14px", fontWeight: "bold" }}>
                          Total tickets handled by Team: {" "}
                        <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "14px" }}>
                          {totalCount}
                        </Typography>
                        <Typography> </Typography>
                      </Typography>
                      <br />
                        
                      {Object.entries(asigneeNameCountsAll).map(([name, count]) => (
                      <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                          {name}: {" "}
                        <Typography variant="body2" align='justify' display="inline" sx={{ fontSize: "12px" }}>
                            {count}
                        </Typography>
                        <Typography> </Typography>
                      </Typography>
                      ))}
                  </Box>
                  </Modal>
            </Box>
            <br />
              <PieChart data={dataPie} ></PieChart>
          </Box>
          </Box>
       
        <Box  display="flex" width={"100%"} justifyContent="center" alignItems="stretch" sx={{height: '100%'}}>

        <Box id= "chart-container9" width="50%"  m={2} alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" , height: '100%'}}>
            <br />
            <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "-20px", marginRight: "-85%", cursor: "pointer" }}>
                    <Tooltip title= "Click to download graph image" arrow>
                      <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container9')}></Button>
                    </Tooltip>
              </Box>
                  <Typography align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Order Management: Tickets category</Typography>
                  
                  <BarChart
                    data={{
                      labels: Object.keys(teamCategoryCount).filter(type => teamCategoryCount[type] !== 0),
                      values: Object.values(teamCategoryCount).filter(count => count !== 0),
                      colors: Object.keys(teamCategoryCount).map(() => {
                        const r = Math.floor(Math.random() * 255);
                        const g = Math.floor(Math.random() * 255);
                        const b = Math.floor(Math.random() * 255);
                        return `rgb(${r}, ${g}, ${b})`;
                      })
                    }}
                  />
          </Box>      

          <Box id= "chart-container10" width="50%"  m={2} alignItems="center" sx={{ boxShadow: 3, borderRadius: '6px', backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" , height: '100%'}}>
            <br />
                  <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-10px", marginBottom: "-20px", marginRight: "-85%", cursor: "pointer" }}>
                    <Tooltip title= "Click to download graph image" arrow>
                      <Button size="large" endIcon={<MoreVertIcon style={{ color: '#4D4D52' }} />} onClick={() => handleDownloadImage('chart-container10')}></Button>
                    </Tooltip>
                  </Box>
                  
                  <Typography align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Order Management: Tickets Status</Typography>
                  
                  <BarChart
                    data={{
                      labels: Object.keys(teamStatusCount).filter(type => teamStatusCount[type] !== 0),
                      values: Object.values(teamStatusCount).filter(count => count !== 0),
                      colors: Object.keys(teamStatusCount).map(() => {
                        const r = Math.floor(Math.random() * 255);
                        const g = Math.floor(Math.random() * 255);
                        const b = Math.floor(Math.random() * 255);
                        return `rgb(${r}, ${g}, ${b})`;
                      })
                    }}
                  />
          </Box>

        </Box>
        <br /><br /><br />

      </Container>
    </Container>

    </>
  )
}
