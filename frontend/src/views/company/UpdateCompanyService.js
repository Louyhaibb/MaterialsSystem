/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Container, Form, Row, Label, Button } from "reactstrap";
import classnames from 'classnames';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Autocomplete from 'react-google-autocomplete';
import { useGetServiceQuery, useUpdateServiceMutation } from "../../redux/api/serviceAPI";
import { isObjEmpty } from "../../utils/Utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateCompanyService = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: service, refetch: refetchService } = useGetServiceQuery(id);
    const [updateCompanyService, { isLoading, isSuccess, error, isError, data }] = useUpdateServiceMutation();
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        setValue,
        formState: { errors }
    } = useForm();
    const [addressObj, setAddressObj] = useState();
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        refetchService();
    }, [refetchService]);

    useEffect(() => {
        if (service) {
            const fields = ['description', 'basePrice', 'serviceType'];
            fields.forEach((field) => setValue(field, service[field]));
            setDateRange([new Date(service.availability.startDate), new Date(service.availability.endDate)]);
            setAddressObj(service.address);
        }
    }, [service]);

    const onSubmit = (data) => {
        if (!addressObj) {
            setError('address', {
                type: 'manual',
                message: 'Please select an address using the suggested option'
            });
        }

        if (!startDate || !endDate) {
            setError('dateRange', {
                type: 'manual',
                message: 'Please select a valid date range.',
            });
            return;
        }

        if (isObjEmpty(errors)) {
            data.address = addressObj;
            data.availability = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            updateCompanyService({ id: id, service: data });
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
                        <h4 className="main-title">Update Company Service</h4>
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
                                                            clearErrors('dateRange');
                                                        }}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        selectsRange
                                                        className={`form-control ${classnames({ 'is-invalid': errors.dateRange })}`}
                                                        placeholderText="Select a date range"
                                                    />
                                                    {errors.dateRange && <small className="text-danger">{errors.dateRange.message}</small>}
                                                </div>

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
                                                        types: ['address'],
                                                        componentRestrictions: { country: 'il' }
                                                    }}
                                                    defaultValue={addressObj || ''} // Set the initial value for address
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

export default UpdateCompanyService;

