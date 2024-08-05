/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCreateOrderRequestMutation, useGetCompanyDetailQuery } from "../../redux/api/orderAPI";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Label, Button } from "reactstrap";
import classnames from 'classnames';
import { toast } from 'react-toastify';
import companyImg from "../../assets/images/company.png";
import { useForm } from 'react-hook-form';
import FullScreenLoader from "../../components/FullScreenLoader";
import Autocomplete from 'react-google-autocomplete';
import { isObjEmpty } from "../../utils/Utils";

const OrderRequest = () => {
    const { id } = useParams();
    const { data: company, refetch: refetchCompany, isLoading } = useGetCompanyDetailQuery(id);
    const [createOrderRequest, { isLoading: createIsLoading, isSuccess, error, isError, data }] = useCreateOrderRequestMutation();
    const [addressObj, setAddressObj] = useState();
    
    useEffect(() => {
        refetchCompany();
    }, [refetchCompany]);

    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => { 
        if (!addressObj) {
            errors.address = {};
            setError('address', {
                type: 'manual',
                message: 'Please select an address using the suggested option'
            });
        }
        if (isObjEmpty(errors)) {
            data.address = addressObj;
            data.company = id;
            // Calculate totalPrice
            const selectedServices = company?.services.filter(service => data.services.includes(service._id)) || [];
            const selectedAdditionalServices = company?.services.flatMap(service =>
                service.additionalServices.filter(addService => data.additionalServices.includes(addService._id))
            ) || [];

            const totalBasePrice = selectedServices.reduce((acc, service) => acc + service.basePrice, 0);
            const totalAdditionalUnitPrice = selectedAdditionalServices.reduce((acc, addService) => acc + addService.unitPrice, 0);

            data.totalPrice = totalBasePrice + totalAdditionalUnitPrice;
            
            createOrderRequest(data);
        }
        
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
        }
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [createIsLoading]);

    return (
        <>
            {isLoading ? <FullScreenLoader /> : (
                <div className="main-view">
                    <Container>
                        <Row className="my-3">
                            <Col>
                                <h4 className="main-title">Order Request</h4>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Col>
                                <Card className="p-5">
                                    <div className="mb-2">
                                        <img className="company-image mb-3" src={company.avatar || companyImg} alt={company.name} />
                                        <h5>{company.name}</h5>
                                    </div>
                                    <div className="mb-2">
                                        <span><strong>Email:</strong> {company.email}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span><strong>Phone:</strong> {company.phone}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span><strong>Address:</strong> {company.address}</span>
                                    </div>
                                    <hr />
                                    <div className="mt-2">
                                        <span><strong>Order Detail</strong></span>
                                    </div>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-2">
                                                    <Label for="services">Service</Label>
                                                    <select name="services"
                                                        className={`form-control ${classnames({ 'is-invalid': errors.services })}`}
                                                        {...register('services', { required: true })}
                                                        multiple
                                                    >
                                                        {company?.services.map(service => (
                                                            <option key={service._id} value={service._id}>{service.serviceType}</option>
                                                        ))}
                                                    </select>
                                                    {errors.services && <small className="text-danger">Service is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-2">
                                                    <Label for="additionalServices">Additional Services</Label>
                                                    <select id="additionalServices" name="additionalServices"
                                                        className={`form-control ${classnames({ 'is-invalid': errors.additionalServices })}`}
                                                        {...register('additionalServices')}
                                                        multiple
                                                    >
                                                        {company?.services.flatMap(service =>
                                                            service.additionalServices.map(addService => (
                                                                <option key={addService._id} value={addService._id}>{addService.serviceName}</option>
                                                            ))
                                                        )}
                                                    </select>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-2">
                                                    <Label for="transferDate">Transfer Date</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.orderDate })}`}
                                                        type="datetime-local"
                                                        id="orderDate"
                                                        {...register('orderDate', { required: true })}
                                                    />
                                                    {errors.orderDate && <small className="text-danger">Transfer Date is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-2">
                                                    <Label for="dropOffLocation">Drop-off Location</Label>
                                                    <Autocomplete
                                                        className="form-control"
                                                        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                                        onChange={(e) => setAddressObj()}
                                                        onPlaceSelected={(place) => {
                                                            clearErrors('address');
                                                            setAddressObj(place);
                                                        }}
                                                        options={{
                                                            types: ['address'],
                                                            componentRestrictions: { country: 'il' }
                                                        }}
                                                    />
                                                    {errors.address && <small className="text-danger mt-1">{errors.address.message}</small>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="mt-4">
                                            <Button color="primary" className="btn-block" type="submit">
                                                Order Request
                                            </Button>
                                        </div>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}

export default OrderRequest;
