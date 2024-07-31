/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import logo1Img from '../../assets/images/logo-1.png';
import { useRegisterUserMutation } from '../../redux/api/authAPI';
import { isObjEmpty } from '../../utils/Utils';

const CompanyRegister = () => {
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm();

    const [addressObj, setAddressObj] = useState();

    // 👇 Calling the Register Mutation
    const [registerUser, { isLoading, isSuccess, error, isError, data }] = useRegisterUserMutation();

    const navigate = useNavigate();

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
            data.role = 'company';
            registerUser(data);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/login');
        }
    
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);
    

    return (
        <div className="auth-wrapper auth-v1 px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="logo" src={logo1Img} alt="Materials" />
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="body-meta">
                                    Looking for care?{' '}
                                    <Link to="/client-register">
                                        <span className="fw-bold">Sign up as a Client →</span>
                                    </Link>
                                </p>
                                <h4 className="text-start">Company, create a account</h4>
                                <p className="body-2 md-vertical-spacing">
                                    Already have an account?{' '}
                                    <a href="/login" className='fw-bold'>
                                        Log in
                                    </a>
                                </p>
                            </div>
                        </div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className='mb-2'>
                                <Label>Company Name</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.companyName })}`}
                                    type="text"
                                    id="companyName"
                                    {...register('companyName', { required: true })}
                                />
                                {errors.companyName && <small className="text-danger">Company Name is required.</small>}
                            </div>
                            <div className='mb-2'>
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    id="email"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && <small className="text-danger">Email is required.</small>}
                            </div>
                            <div className='mb-2'>
                                <Label>Phone Number</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                    type="text"
                                    id="phone"
                                    {...register('phone', { required: true })}
                                />
                                {errors.phone && <small className="text-danger">Phone Number is required.</small>}
                            </div>
                            <div className='mb-2'>
                                <Label>Business License Number</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.businessLicense })}`}
                                    type="text"
                                    id="businessLicense"
                                    {...register('businessLicense', { required: true })}
                                />
                                {errors.businessLicense && <small className="text-danger">Business License Number is required.</small>}
                            </div>
                            <div className='mb-2'>
                                <Label>Address</Label>
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
                            <div className='mb-2'>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <small className="text-danger">Password is required.</small>}
                            </div>
                            <div className="mt-4">
                                <Button color="orange" className="btn btn-block w-100" type="submit">
                                    SIGN UP
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default CompanyRegister;
