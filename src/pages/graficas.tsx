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
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas'; 
import Tooltip from '@mui/material/Tooltip';
import jsPDF from 'jspdf';
import DonutChart from '@/components/donutChart';
import domtoimage from 'dom-to-image';

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

    //asignee names modal
    const [openAssignee, setOpenAssignee] = useState(false);
    const handleOpenAssignee = () => setOpenAssignee(true);
    const handleCloseAssignee = () => setOpenAssignee(false);

    //tickets by service bar chart modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //forwared gropus modal
    const [openGroups, setOpenGroups] = useState(false);
    const handleOpenGroups = () => setOpenGroups(true);
    const handleCloseGroups = () => setOpenGroups(false);

    //bar chart services
    const services2 = Array.from(new Set(allData.slice(1).map((row:any) => row[2] ? row[2] : null)))

    const services: Service[] = services2.map(type => ({ type }));

    const countServices = (services: Service[], data: any[]) => {
    return services.reduce((counts, service) => {
        const type = service.type;
        counts[type] = data.filter(row => row[2] === type).length;
        return counts;
    }, {});
    };

    const serviceCounts = countServices(services, allData);

    // Sort services in descending order based on counts
    const sortedServices = Object.entries(serviceCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .reduce((sortedObj, [type, count]) => {
      sortedObj[type] = count;
      return sortedObj;
    }, {});

    //top 10 services
    const topServices = Object.entries(serviceCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10)
    .map(([type, count]) => ({ type, count }));

    //pie chart assignee name
    const assigneeName = Array.from(new Set(allData.slice(1).map((row:any) => {
      if (row[4] === "Order Management Customizing and Services") {
        return row[18] ? row[18] : null;
      }
    })));
    
    const assigneeNames: Asignee[] = assigneeName.map(type => ({ type })).sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    });

    const countAsigneeNamesAll = (assigneeNames: Asignee[], data: any[]) => {
    return assigneeNames.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(row => row[18] === type && row[4] === "Order Management Customizing and Services").length;
        return counts;
    }, {});
    };

    const asigneeNameCountsAll = countAsigneeNamesAll(assigneeNames, allData);

    //count total sum of tickets handled by team
    const countTeamAll = (assigneeNames: Asignee[], data:any[]) => {
      const counts = assigneeNames.reduce((counts, name) => {
        const type = name.type; 
        counts[type] = data.filter(row => row[18] === type && row[4] === "Order Management Customizing and Services").length;
        return counts;
      }, {});
    
      const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      return {
        totalCount
      };
    };
    
    const countTeam = countTeamAll(assigneeNames, allData);
    const totalCount = countTeam.totalCount;

    const countAsigneeNames = (assigneeNames: Service[], data: any[]) => {
      const counts = assigneeNames.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(row => row[18] === type && row[4] === "Order Management Customizing and Services").length;
        return counts;
      }, {});
      const entries = Object.entries(counts);
      const sortedEntries = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
      return Object.fromEntries(sortedEntries);
    };
    
    const asigneeNameCounts = countAsigneeNames(assigneeNames, allData);

    // Create an array of the top 10 names with highest counts
    const topNames = Object.entries(asigneeNameCounts)
    .sort(([, countA], [, countB]) => countB - countA) // sort by count in descending order
    .slice(0, 10) // take only the top 10 names
    .map(([name]) => name); // extract the names only

    // Create an array of the counts corresponding to the top names
    const topCounts = topNames.map(name => asigneeNameCounts[name]);
    
    // data for pie chart tickets handled by team
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

    //pie chart assignee name
    const categories2 = Array.from(new Set(allData.slice(1).map((row: any) => row[19] ? row[19] : null)));

    const categories: Category[] = categories2.map(type => ({ type }));

    const countCategories = (categories: Category[], data: any[]) => {
      return categories.reduce((counts, category) => {
        const type = category.type;
        counts[type] = data.filter(row => row[19] === type).length;
        return counts;
      }, {});
    };

    const categoryCounts = countCategories(categories, allData);

    //priority and status stacked bar chart 
    const countByStatusAndPriority = (data:any) => {
        const counts = {};
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


    //count forwarded tickets
    const forwardedToGroup = Array.from(
      new Set(
        allData.slice(1).map((row: any) => {
          if (
            row[4] === "Order Management Customizing and Services" &&
            row[16] === 1
          ) {
            return row[33] ? row[33] : null;
          }
        })
      )
    );

    const forwardedToGroups: Asignee[] = forwardedToGroup
      .map((type) => ({ type }))
      .sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
    });

    const countForwardedToGroups = (forwardedToGroups: Asignee[], data: any[]) => {
      return forwardedToGroups.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(
          (row) =>
            row[33] === type &&
            row[4] === "Order Management Customizing and Services" &&
            row[16] === 1
        ).length;
        return counts;
      }, {});
    };

    const countAllForwardedToGropus = countForwardedToGroups(forwardedToGroups, allData);
    console.log("forwardeados", countAllForwardedToGropus);

    // Remove first 7 characters of each name
    const modifiedCounts = {};
    for (const [name, count] of Object.entries(countAllForwardedToGropus)) {
      const modifiedName = name.substring(7, name.length - 1);
      modifiedCounts[modifiedName] = count;
    }

    console.log("Forwarded names and counts after removing first 7 characters:");
    console.log(modifiedCounts);

    // Find the top 10 names with the greatest counts
    const sortedNames = Object.entries(modifiedCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log("Top 10 names and counts:");
    console.log(sortedNames);

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

    const handleDownloadImage = (elementId:any) => {
      const chartContainer = document.getElementById(elementId); // Get the chart container element
      html2canvas(chartContainer).then(canvas => {
        const image = canvas.toDataURL('image/png'); // Convert canvas to image data URL
        const downloadLink = document.createElement('a'); // Create a download link element
        downloadLink.href = image; // Set the image data URL as the link's href
        downloadLink.download = 'graph.png'; // Set the download filename
        downloadLink.click(); // Trigger the download
      });
    };

    const handleDownloadPdf = async (elementId: any) => {
      const chartContainer = document.getElementById(elementId);
    
      const options = {
        style: {
          'transform-origin': 'center',
        },
        quality: 1,
        height: chartContainer.offsetHeight * 2, // Increase the height to improve image quality
        width: chartContainer.offsetWidth * 2, // Increase the width to improve image quality
      };
    
      try {
        const dataUrl = await domtoimage.toPng(chartContainer, options);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('graphs_pdf.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
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

    <Container id="all-data">
        <br />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant='h3' align='center'>Graphics</Typography> 
          <Tooltip title="Download all graphics as PDF">
            <Button size="large" endIcon={<DownloadIcon />} sx={{ color: 'grey' }} onClick={() => handleDownloadPdf('all-data')}></Button>
          </Tooltip>
        </Box>
      
        <br />

       {/*  Number of tickets by Service */}
        <Box id= "chart-container1" display="flex" width={"100%"} justifyContent="center" alignItems="center">
            <Box display="flex" m={2} flexDirection="row" width="100%"  alignItems="center" sx={{ backgroundColor: "white" }} >
                <Box display="flex" flexDirection="column" width="100%"  alignItems="center">
                    <br />
                    <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Number of tickets by Service </Typography>
                    <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-20px", marginBottom: "-20px", marginRight: "-90%", cursor: "pointer" }}>
                      <Tooltip title= "Click to download graph image">
                        <Button size="large" endIcon={<DownloadIcon />} onClick={() => handleDownloadImage('chart-container1')}></Button>
                      </Tooltip>
                    </Box>

                    <br />
                    <Button variant="text" onClick={handleOpen}>See Details</Button>
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

                    <Box display="flex" width="100%" alignItems="center" justifyContent="center">

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
        
        {/* Tickets by status and priority and tickets handled by team */}
        <Box display="flex" width={"100%"} justifyContent="center" alignItems="stretch">

          <Box width="50%"  m={2} alignItems="center" sx={{ backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <br />
              <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets by Status and Priority </Typography> 
              <StackedBarChart data={transformedData} />
          </Box>

          <Box width="50%"  m={2} alignItems="center" sx={{ backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <br />
            <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets category</Typography> 
              <BarChart
                data={{
                  labels: Object.keys(categoryCounts).filter(type => categoryCounts[type] !== 0),
                  values: Object.values(categoryCounts).filter(count => count !== 0),
                  colors: Object.keys(categoryCounts).map(() => {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    return `rgb(${r}, ${g}, ${b})`;
                  })
                }}
                

              />
          </Box>
 
        </Box>

        {/* Forwared y de categoria */}
        <Box display="flex" width={"100%"} justifyContent="center" alignItems="stretch">

          <Box width="50%"  m={2} alignItems="center" sx={{ backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <br />
              <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets handled by Support Group </Typography> 
              <br />
              <DonutChart data={{ 
                        labels: ['Order Management Customizing and Services', 'Others'], 
                        values: [totalCount, (allData.length - totalCount - 1)], 
                        colors: generateRandomColors(2) }} />
          </Box>

          <Box width="50%"  m={2} alignItems="center" sx={{ backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"  }}>
            <br />
            <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets handled by Order Management Customizing and Services </Typography> 
            <Box display="flex" flexDirection="column" width="100%"  alignItems="center">
              <br />
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

        {/*  forwarded */}
        <Box id= "chart-container4" display="flex" width={"100%"} justifyContent="center" alignItems="center">
            <Box display="flex" m={2} flexDirection="row" width="100%"  alignItems="center" sx={{ backgroundColor: "white" }} >
                <Box display="flex" flexDirection="column" width="100%"  alignItems="center">
                    <br />
                    <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Forwarded Tickets </Typography>
                    <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "-20px", marginBottom: "-20px", marginRight: "-90%", cursor: "pointer" }}>
                      <Tooltip title= "Click to download graph image">
                        <Button size="large" endIcon={<DownloadIcon />} onClick={() => handleDownloadImage('chart-container1')}></Button>
                      </Tooltip>
                    </Box>

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
                                {Object.entries(modifiedCounts).map(([groupName, count]) => (
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
    
    </>
  )
}
