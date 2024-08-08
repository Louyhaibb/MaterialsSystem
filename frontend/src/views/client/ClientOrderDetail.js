/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Form, Label } from "reactstrap"; // Added Button import
import { useGetOrderQuery } from "../../redux/api/orderAPI";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import FullScreenLoader from "../../components/FullScreenLoader";
import { Star } from "react-feather";
import { useLeaveReviewMutation } from "../../redux/api/reviewAPI";

const ClientOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedStars, setSelectedStars] = useState(0);
    const [hoveredStars, setHoveredStars] = useState(0);
    const [totalStars, setTotalStars] = useState(5);
    const { data: order, refetch: refetchOrder, isLoading } = useGetOrderQuery(id);
    const [leaveReview, { isLoading: createIsLoading, isSuccess, error, isError, data }] = useLeaveReviewMutation();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

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

    const renderActionButton = (status) => {
        if (status === 'Completed') {
            return <Button color="outline-success" onClick={() => setModalVisibility(!modalVisibility)}>Leave Review</Button>;
        }
        return null;
    };

    const handleClose = async () => {
        setModalVisibility(!modalVisibility);
    };

    const handleStarHover = (star) => {
        setHoveredStars(star);
    };

    const handleStarClick = (star) => {
        setSelectedStars(star);
    };

    const handleSaveButtonClick = () => {
        handleSubmit(onSubmit)();
    };

    const onSubmit = (data) => {
        data.client = order.client?._id;
        data.company = order.company?._id;
        data.rating = hoveredStars || selectedStars;
        data.orderNumber = order.orderNumber;
        leaveReview(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/client/orders');
        }
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [createIsLoading]);

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= totalStars; i++) {
            stars.push(
                <li key={i} className="ratings-list-item me-25">
                    <Star
                        key={i}
                        onClick={() => handleStarClick(i)}
                        onMouseEnter={() => handleStarHover(i)}
                        className={i <= (hoveredStars || selectedStars) ? 'filled-star' : 'unfilled-star'}
                        style={{ cursor: 'pointer' }}
                    />
                </li>
            );
        }
        return stars;
    };

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
                                                <strong>Client:</strong> {order.client?.name}
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
                                        <Col md="6">
                                            <div className="mb-2 detail-item">
                                                <span>
                                                    <strong>Company:</strong> {order.company?.name}
                                                </span>
                                                <span className="mx-3">
                                                    <a className="btn btn-orange btn-sm" href={`/client/company-profile/${order.company?._id}`}>View</a>
                                                </span>
                                                
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
                    <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
                        <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Review</ModalHeader>
                        <ModalBody>
                            <Form onSubmit={handleSubmit(onSubmit)} id="review">
                                <FormGroup>
                                    <Label>Rating</Label>
                                    <div className="item-rating">
                                        <ul className="unstyled-list list-inline">{renderStars()}</ul>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Review</Label>
                                    <textarea
                                        className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                                        type="text"
                                        id="comment"
                                        rows={6}
                                        placeholder="Please input here..."
                                        {...register('comment', {
                                            required: 'Review is required.'
                                        })}></textarea>
                                    {errors.comment && <span className="text-danger">{errors.comment.message}</span>}
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="orange" onClick={handleSaveButtonClick}>
                                Post Review
                            </Button>
                            <Button color="dark" onClick={handleClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )}
        </>
    );
}

export default ClientOrderDetail;
