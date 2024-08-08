/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "reactstrap"; // Added Button import
import { useGetOrderQuery, useUpdateOrderStatusMutation } from "../../redux/api/orderAPI";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import FullScreenLoader from "../../components/FullScreenLoader";

const CompanyOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: order, refetch: refetchOrder, isLoading } = useGetOrderQuery(id);
    const [updateOrderStatus, { isLoading: updateIsLoading, isSuccess, error, isError, data }] = useUpdateOrderStatusMutation();

    useEffect(() => {
        refetchOrder();
    }, [refetchOrder]);

    const renderStatusBadge = (status) => {
        let color;
        switch (status) {
            case 'Pending':
                color = 'warning';
                break;
            case 'Approved':
                color = 'info';
                break;
            case 'Completed':
                color = 'success';
                break;
            default:
                color = 'secondary';
        }
        return <Badge color={color} className="ms-2">{status}</Badge>;
    };

    const handleApprove = () => {
        const data = {
            orderId: order._id,
            status: 'Approved'
        }
        updateOrderStatus(data);
    };

    const handleComplete = () => {
        const data = {
            orderId: order._id,
            status: 'Completed'
        }
        updateOrderStatus(data);
    };

    const renderActionButton = (status) => {
        if (status === 'Pending') {
            return <Button color="outline-primary" onClick={handleApprove}>Approve Order</Button>;
        } else if (status === 'Approved') {
            return <Button color="outline-success" onClick={handleComplete}>Complete Order</Button>;
        }
        return null;
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/company/orders');
        }
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [updateIsLoading]);

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-view">
                    <Container>
                        <Row className="my-3">
                            <Col>
                                <h4 className="main-title">
                                    Order Number #{order.orderNumber} {renderStatusBadge(order.status)}
                                </h4>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col>
                                <Card className="p-5 detail-card">
                                    <Row>
                                        <Col md="6">
                                            <div className="mb-2 detail-item">
                                                <strong>Company:</strong> {order.company?.name}
                                            </div>
                                            <div className="mb-2 detail-item">
                                                <strong>Email:</strong> {order.company?.email}
                                            </div>
                                            <div className="mb-2 detail-item">
                                                <strong>Phone:</strong> {order.company?.phone}
                                            </div>
                                            <div className="mb-2 detail-item">
                                                <strong>Address:</strong> {order.company?.address}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2 detail-item">
                                                <span>
                                                    <strong>Client:</strong> {order.client?.name}
                                                </span>
                                                <span className="mx-3">
                                                    <a className="btn btn-orange btn-sm" href={`/company/client-profile/${order.client?._id}`}>View</a>
                                                </span>
                                            </div>
                                            <div className="mb-2 detail-item">
                                                <strong>Email:</strong> {order.client?.email}
                                            </div>
                                            <div className="mb-2 detail-item">
                                                <strong>Phone:</strong> {order.client?.phone}
                                            </div>
                                            <div className="mb-2 detail-item">
                                                <strong>Address:</strong> {order.client?.address}
                                            </div>
                                        </Col>
                                    </Row>

                                    <hr />
                                    <div className="services-section mt-2">
                                        <h5 className="section-title"><strong>Company Services</strong></h5>
                                        <div>
                                            {order.services.map(service => (
                                                <div key={service._id} className="service-item">
                                                    <div className="service-type">{service.serviceType}:</div>
                                                    <div className="service-description">{service.description}</div>
                                                    <div className="service-price"><strong>Base Price:</strong> ${service.basePrice}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <h5 className="section-title mt-3"><strong>Additional Services</strong></h5>
                                        <div>
                                            {order.additionalServices.map(additionalService => (
                                                <div key={additionalService._id} className="service-item">
                                                    <div className="service-name">{additionalService.serviceName}:</div>
                                                    <div className="service-description">{additionalService.description}</div>
                                                    <div className="service-price"><strong>Unit Price:</strong> ${additionalService.unitPrice}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="total-price mt-3">
                                            <strong>Total Price:</strong> ${order.totalPrice}
                                        </div>
                                        <div className="mt-3">
                                            {renderActionButton(order.status)}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}

export default CompanyOrderDetail;
