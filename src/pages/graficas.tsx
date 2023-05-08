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


/* 
- Bar chart: You can use a bar chart to show the number of incidents by each category or service. 
This can give you a quick overview of which category or service has the highest number of incidents.

- Stacked bar chart: A stacked bar chart can be used to show the distribution of incidents by priority and status. 
This can give you an idea of how many incidents are open, closed, or in progress for each priority level.

- Pie chart: A pie chart can be used to show the percentage of incidents by support group or assignee. 
This can help you identify which support group or assignee is handling the highest number of incidents.

- Heatmap: A heatmap can be used to visualize the distribution of incidents by created date and support group. 
This can help you identify if there are any support groups that are experiencing a high volume of incidents during a specific time period.

- Scatter plot: A scatter plot can be used to show the relationship between the duration of incidents and the priority level. 
This can help you identify if there is any correlation between the priority level of an incident and how long it takes to resolve it. */

interface Service {
    type: string;
}

interface Asignee {
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


    //tickets by service bar chart
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
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


    //pie chart assignee name
    const assigneeName = Array.from(new Set(allData.slice(1).map((row:any) => row[18] ? row[18] : null)))

    //const assigneeNames: Asignee[] = assigneeName.map(type => ({ type }));

    const assigneeNames: Asignee[] = assigneeName.map(type => ({ type })).sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    });

    const countAsigneeNamesAll = (assigneeNames: Asignee[], data: any[]) => {
    return assigneeNames.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(row => row[18] === type).length;
        return counts;
    }, {});
    };

    const asigneeNameCountsAll = countAsigneeNamesAll(assigneeNames, allData);

    const countAsigneeNames = (assigneeNames: Service[], data: any[]) => {
      const counts = assigneeNames.reduce((counts, name) => {
        const type = name.type;
        counts[type] = data.filter(row => row[18] === type).length;
        return counts;
      }, {});
      const entries = Object.entries(counts);
      const sortedEntries = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
      return Object.fromEntries(sortedEntries);
    };
    
    const asigneeNameCounts = countAsigneeNames(assigneeNames, allData);

    console.log("names", asigneeNameCounts);

    // Create an array of the top 10 names with highest counts
    const topNames = Object.entries(asigneeNameCounts)
    .sort(([, countA], [, countB]) => countB - countA) // sort by count in descending order
    .slice(0, 10) // take only the top 10 names
    .map(([name]) => name); // extract the names only

    // Create an array of the counts corresponding to the top names
    const topCounts = topNames.map(name => asigneeNameCounts[name]);
    
    // Define the data object required by Chart.js
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

    //console.log("aver", statusPriorityCounts);




  return(
    <>

    <Container >
        <br />
        <Typography variant='h3' align='center'>Graphics</Typography>
        <br />

        <Box display="flex" width={"100%"} justifyContent="center" alignItems="center">
            <Box display="flex" m={2} flexDirection="row" width="100%" alignItems="center" sx={{ backgroundColor: "white" }} >
                <Box display="flex" flexDirection="column" width="100%"  alignItems="center">
                    <br />
                    <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Number of tickets by Service </Typography> 
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
                                {Object.entries(serviceCounts).map(([serviceName, count]) => (
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
                            labels: Object.keys(serviceCounts),
                            values: Object.values(serviceCounts),
                            colors: Object.keys(serviceCounts).map(() => {
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

        <Box display="flex" width={"100%"} justifyContent="center" alignItems="center">

          <Box width="50%"  m={2} alignItems="center" sx={{ backgroundColor: "white" }}>
              <br />
              <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets by Status and Priority </Typography> 
              <StackedBarChart data={transformedData} />
          </Box>

          <Box width="50%" minHeight={"770px"} m={2} alignItems="center" sx={{ backgroundColor: "white" }}>
            <br />
            <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets by Assignee Name </Typography> 
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
                    <Typography id="modal-modal-title2" align='center' variant='h6' sx={{ fontWeight: 'bold' }}> Number of tickets by Service Details </Typography>
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

    </Container>
    
   
    </>
  )
}
