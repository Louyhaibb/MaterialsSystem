/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Container, Row, Label } from "reactstrap";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetServiceQuery } from "../../redux/api/serviceAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { formatDateRange } from "../../utils/Utils";

const ClientServiceDetail = () => {
    const { id } = useParams();
    const { data: service, refetch: refetchService, isLoading } = useGetServiceQuery(id);

    useEffect(() => {
        refetchService();
    }, [refetchService]);

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-view">
                    <Container>
                        <Row className="my-3">
                            <Col>
                                <h4 className="main-title">Service Details</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col md="6" className="mb-3">
                                                <Label><strong>Service Type:</strong></Label>
                                                <p>{service.serviceType}</p>
                                            </Col>
                                            <Col md="6" className="mb-3">
                                                <Label><strong>Base Price:</strong></Label>
                                                <p>${service.basePrice}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6" className="mb-3">
                                                <Label><strong>Availability:</strong></Label>
                                                <p>{formatDateRange(service.availability)}</p>
                                            </Col>
                                            <Col md="6" className="mb-3">
                                                <Label><strong>Location:</strong></Label>
                                                <p>{service.address}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" className="mb-3">
                                                <Label><strong>Description:</strong></Label>
                                                <p>{service.description}</p>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>

    )
}

export default ClientServiceDetail;
