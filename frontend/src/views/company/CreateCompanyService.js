/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Container, Form, Row, Label, Button } from "reactstrap";
import classnames from 'classnames';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Autocomplete from 'react-google-autocomplete';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    const [addressObj, setAddressObj] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const onSubmit = (data) => {
        if (!startDate || !endDate) {
            setError('availability', {
                type: 'manual',
                message: 'Please select a valid date range.',
            });
            return;
        }

        if (!addressObj) {
            setError('address', {
                type: 'manual',
                message: 'Please select an address using the suggested option'
            });
            return;
        }

        if (isObjEmpty(errors)) {
            data.address = addressObj;
            data.availability = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            console.log(data)
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
                                                    <option value="">Select a Service</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Apartment">Apartment</option>
                                                    <option value="Small Transfer">Small Transfer</option>
                                                    <option value="Warehouse">Warehouse</option>
                                                    <option value="History">History</option>
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
                                                <div className="mt-0">
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={(update) => {
                                                            setDateRange(update);
                                                            clearErrors('availability');
                                                        }}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        selectsRange
                                                        className={`form-control ${classnames({ 'is-invalid': errors.availability })}`}
                                                        placeholderText="Select a date range"
                                                    />
                                                    {errors.availability && <small className="text-danger">{errors.availability.message}</small>}
                                                </div>

                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className='mb-2'>
                                                <Label>Location</Label>
                                                <Autocomplete
                                                    className="form-control"
                                                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                                    onChange={(e) => setAddressObj(null)}
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
    );
}

export default CreateCompanyService;
