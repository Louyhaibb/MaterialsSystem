/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { useEffect } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useGetStatisticsQuery } from "../../redux/api/statsAPI";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController
);

const Statistics = () => {
    const { data: statData, isLoading, refetch } = useGetStatisticsQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const statisticdata = {
        labels: statData?.dates,
        datasets: [
            {
                label: 'Transfers Completed',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: statData?.transferCounts,
            },
            {
                label: 'Revenue Generated',
                backgroundColor: 'rgba(255,99,132,0.4)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.6)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: statData?.revenueCounts,
            },
            {
                label: 'User Activity',
                backgroundColor: 'rgba(54,162,235,0.4)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54,162,235,0.6)',
                hoverBorderColor: 'rgba(54,162,235,1)',
                data: statData?.userActivityCounts,
            },
        ],
    };

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-view">
                    <Container>
                        <Row className="my-3">
                            <Col>
                                <h4 className="main-title">Statistics</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Bar
                                            data={statisticdata}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <h5>Top 10 Most Popular Services</h5>
                                <ul>
                                    {statData?.serviceCounts?.map((service, index) => (
                                        <li key={index}>
                                            <strong>{index + 1}. {service.service.serviceType}</strong> - {service.service.description}<br/>
                                            <small>Base Price: ${service.service.basePrice}, Count: {service.count}</small><br/>
                                            <small>Location: {service.service.address}</small>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}

export default Statistics;
