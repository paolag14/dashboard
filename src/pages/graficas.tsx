import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import BarChart from '../components/barChart';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import StackedBarChart from '@/components/stackedBarChart';

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const services2 = Array.from(new Set(allData.slice(1).map((row:any) => row[2] ? row[2] : null)))
    console.log(services2);

    const services: Service[] = services2.map(type => ({ type }));

    const countServices = (services: Service[], data: any[]) => {
    return services.reduce((counts, service) => {
        const type = service.type;
        counts[type] = data.filter(row => row[2] === type).length;
        return counts;
    }, {});
    };

    const serviceCounts = countServices(services, allData);

    console.log(serviceCounts);


  return(
    <>

    <Container >
        <br />
        <Typography variant='h3' align='center'>Graphics</Typography>
        <br />

        <Box display="flex" width={"100%"} justifyContent="center" alignItems="center">
            <Box display="flex" m={2}  flexDirection="row" width="50%" alignItems="center" sx={{ backgroundColor: "white" }} >
                <Box display="flex" flexDirection="column" width="100%" alignItems="center">
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
            

            <Box width="50%" m={2} alignItems="center" sx={{ backgroundColor: "white" }}>
                <Typography align='center' variant='h6'  sx={{ fontWeight: 'bold'  }}> Tickets by Status and Priority </Typography> 
                <StackedBarChart data={{
                    labels: ['Assigned', 'Closed', 'In Progress', 'Pending', 'Resolved'],
                    datasets: [
                        {
                        label: 'Low',
                        values: [10, 20, 30, 40, 50, 60, 70],
                        colors: 'rgba(255, 99, 132, 0.2)',
                        },
                        {
                        label: 'Medium',
                        values: [20, 30, 40, 50, 60, 70, 80],
                        colors: 'rgba(54, 162, 235, 0.2)',
                        },
                        {
                        label: 'High',
                        values: [5, 15, 25, 35, 45, 55, 65],
                        colors: 'rgba(255, 206, 86, 0.2)',
                        },
                    ],
                }} />

            </Box>
            
           {/*  <Box width="34%" p={4}>
                <BarChart data={{ 
                                labels: ['Resolved', 'Closed', 'Forwarded', 'Reopened'], 
                                values: [4, 6, 33, 9], 
                                colors: ['#74b72e', '#FF7518', '#FFBF00', '#FF0000'] }} />

            </Box> */}
        </Box>

    </Container>
    
   
    </>
  )
}
