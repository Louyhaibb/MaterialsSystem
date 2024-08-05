/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import classnames from 'classnames';
import { useEffect } from "react";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Card, CardBody, Col, Container, Form, Row, Label, Button } from "reactstrap";
import { useGetServicesQuery } from "../../redux/api/serviceAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useGetAdditionalServiceQuery, useUpdateAdditionalServiceMutation } from "../../redux/api/additionalServiceAPI";

const UpdateAdditionalService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: services, refetch, isLoading } = useGetServicesQuery();
    const { data: additionalService, refetch: refetchAdditionalService } = useGetAdditionalServiceQuery(id);
    const [updateAdditionalService, { isLoading: updateIsLoading, isSuccess, error, isError, data }] = useUpdateAdditionalServiceMutation();
    useEffect(() => {
        refetch();
        refetchAdditionalService();
    }, [refetch, refetchAdditionalService]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        updateAdditionalService({ id: id, service: data });
    }

    useEffect(() => {
        if (additionalService) {
            const fields = ['description', 'unitPrice', 'serviceName', 'service'];
            fields.forEach((field) => setValue(field, additionalService[field]));
        }
    }, [additionalService]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/company/additional-services');
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
                                <h4 className="main-title">Update Additional Service</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col md="6">
                                                    <div className='mb-2'>
                                                        <Label>Service Name</Label>
                                                        <select
                                                            className={`form-control ${classnames({ 'is-invalid': errors.serviceName })}`}
                                                            {...register('serviceName', { required: true })}
                                                        >
                                                            <option value="">Select an Service Name</option>
                                                            <option value="Buying Cartons">Buying Cartons</option>
                                                            <option value="Packaging">Packaging</option>
                                                            <option value="Unloading">Unloading</option>
                                                            <option value="Disassemble/Assemble Furniture">Disassemble/Assemble Furniture</option>
                                                            <option value="Crane Transfers">Crane Transfers</option>
                                                            <option value="Storage Services">Storage Services</option>
                                                        </select>
                                                        {errors.serviceName && <small className="text-danger">Service Name is required.</small>}
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className='mb-2'>
                                                        <Label>Unit Price</Label>
                                                        <input
                                                            className={`form-control ${classnames({ 'is-invalid': errors.unitPrice })}`}
                                                            type="number"
                                                            id="unitPrice"
                                                            {...register('unitPrice', { required: true })}
                                                        />
                                                        {errors.unitPrice && <small className="text-danger">Unit Price is required.</small>}
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <div className='mb-2'>
                                                        <Label>Service</Label>
                                                        <select
                                                            className={`form-control ${classnames({ 'is-invalid': errors.service })}`}
                                                            {...register('service', { required: true })}
                                                        >
                                                            <option value="">Select an Service Name</option>
                                                            {services.map((service, index) => (
                                                                <option key={index} value={service._id}>{service.serviceType}</option>
                                                            ))}


                                                        </select>
                                                        {errors.service && <small className="text-danger">Service is required.</small>}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                    <div className='mb-2'>
                                                        <Label>Description</Label>
                                                        <textarea
                                                            className={`form-control ${classnames({ 'is-invalid': errors.description })}`}
                                                            id="description"
                                                            rows={5}
                                                            {...register('description', { required: true })}
                                                        ></textarea>
                                                        {errors.description && <small className="text-danger">Description is required.</small>}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="mt-4">
                                                <Button color="orange" className="btn-block" type="submit">
                                                    Submit
                                                </Button>
                                            </div>
                                        </Form>
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

export default UpdateAdditionalService;