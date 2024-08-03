/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Container, Form, Row, Label, Button } from "reactstrap";
import classnames from 'classnames';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Autocomplete from 'react-google-autocomplete';
import { useCreateServiceMutation } from "../../redux/api/serviceAPI";
import { isObjEmpty } from "../../utils/Utils";

const CreateCompanyService = () => {
    const navigate = useNavigate();
    const [createCompanyService, { isLoading, isSuccess, error, isError, data }] = useCreateServiceMutation();
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors }
    } = useForm();
    const [addressObj, setAddressObj] = useState();

    const onSubmit = (data) => {
        const selectedDateTime = new Date(data.availability);
        const hours = selectedDateTime.getHours();

        if (hours < 7 || hours >= 23) {
            setError('availability', {
                type: 'manual',
                message: 'Time must be between 7:00 AM and 11:00 PM.',
            });
            return;
        }

        if (!addressObj) {
            errors.address = {};
            setError('address', {
                type: 'manual',
                message: 'Please select an address using the suggested option'
            });
        }
        if (isObjEmpty(errors)) {
            data.address = addressObj;
            createCompanyService(data);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/company/services');
        }
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    return (
        <div className="main-view">
            <Container>
                <Row className="my-3">
                    <Col>
                        <h4 className="main-title">Create Company Service</h4>
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
                                                <Label>Service Type</Label>
                                                <select
                                                    className={`form-control ${classnames({ 'is-invalid': errors.serviceType })}`}
                                                    {...register('serviceType', { required: true })}
                                                >
                                                    <option value="">Select an Service</option>
                                                    <option value="office">Office</option>
                                                    <option value="apartment">Apartment</option>
                                                    <option value="small transfer">Small transfer</option>
                                                    <option value="warehouse">Warehouse</option>
                                                    <option value="history">History</option>
                                                </select>
                                                {errors.serviceType && <small className="text-danger">Service Type is required.</small>}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className='mb-2'>
                                                <Label>Base Price</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.basePrice })}`}
                                                    type="number"
                                                    id="basePrice"
                                                    {...register('basePrice', { required: true })}
                                                />
                                                {errors.basePrice && <small className="text-danger">Base Price is required.</small>}
                                            </div>
                                        </Col>

                                        <Col md="6">
                                            <div className='mb-2'>
                                                <Label>Availability</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.availability })}`}
                                                    type="datetime-local"
                                                    id="availability"
                                                    {...register('availability', { required: true })}
                                                />
                                                {errors.availability && <small className="text-danger">{errors.availability.message}</small>}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className='mb-2'>
                                                <Label>Location</Label>
                                                <Autocomplete
                                                    className="form-control"
                                                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                                    onChange={(e) => setAddressObj()}
                                                    onPlaceSelected={(place) => {
                                                        clearErrors('address');
                                                        setAddressObj(place);
                                                    }}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                />
                                                {Object.keys(errors).length && errors.address ? <small className="text-danger mt-1">{errors.address.message}</small> : null}
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
    )
}

export default CreateCompanyService;