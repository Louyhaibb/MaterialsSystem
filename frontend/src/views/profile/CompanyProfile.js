/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Container, Form, Row, Label, Button } from "reactstrap";
import { getMeAPI } from "../../redux/api/getMeAPI";
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import uploadImg from "../../assets/images/company.png";
import classnames from 'classnames';
import Autocomplete from 'react-google-autocomplete';
import { useUpdateUserMutation, useUploadProfileImgMutation } from "../../redux/api/userAPI";
import { isObjEmpty } from "../../utils/Utils";

const CompanyProfile = () => {
    const { data: user, isLoading } = getMeAPI.endpoints.getMe.useQuery(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [addressObj, setAddressObj] = useState();
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [uploadProfileImg] = useUploadProfileImgMutation();
    const [updateUser, { isLoading: updateIsLoading, isSuccess, error, isError }] = useUpdateUserMutation();
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (user) {
            const fields = ['name', 'email', 'phone', 'role', 'businessLicense'];
            fields.forEach((field) => setValue(field, user[field]));
            if (user.avatar) {
                setImagePreviewUrl(user.avatar);
            }
            setAddressObj(user.address);
            setSelectedRole(user.role);
        }
    }, [user]);
    const onSubmit = (data) => {
        if (avatarFile) {
            data.avatar = avatarFile;
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
            if (selectedRole !== "company") {
                delete data.businessLicense;
            }

            updateUser({ id: user._id, user: data });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Profile updated Successfully!");
        }
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [updateIsLoading]);

    const handleImageChange = async (e) => {
        e.preventDefault();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file instanceof Blob) {
                let reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
                try {
                    const uploadResult = await uploadProfileImg(file).unwrap();
                    const avatarData = uploadResult.updateAvatar.avatar;
                    setAvatarFile(avatarData);
                } catch (error) {
                    console.error('An error occurred during image upload:', error);
                }
            } else {
                console.error('The provided file is not of type Blob.');
            }
        } else {
            console.error('No file selected.');
        }
    };

    return (
        <div className="main-view">
            <Container>
                <Row className="my-3">
                    <Col>
                        <h4 className="main-title">Profile</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label>Image</Label>
                                                <input
                                                    type="file"
                                                    id="avatar"
                                                    className="form-control"
                                                    name="avatarImg"
                                                    onChange={handleImageChange}
                                                    accept=".png, .jpg, .jpeg"
                                                    style={{ display: 'none' }} // hide the input
                                                />
                                                <div
                                                    className="d-flex"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => document.getElementById('avatar').click()}
                                                >
                                                    <img
                                                        id="avatar-preview"
                                                        src={imagePreviewUrl ? imagePreviewUrl : uploadImg}
                                                        alt="Preview"
                                                        width="200px"
                                                        height="200px"
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="8">
                                            <Row>
                                                <Col md="6">
                                                    <div className='mb-2'>
                                                        <Label>Name</Label>
                                                        <input
                                                            className={`form-control ${classnames({ 'is-invalid': errors.name })}`}
                                                            type="text"
                                                            id="name"
                                                            {...register('name', { required: true })}
                                                        />
                                                        {errors.name && <small className="text-danger">Name is required.</small>}
                                                    </div>
                                                </Col>
                                                <Col md="6">
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
                                                </Col>
                                                <Col md="6">
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
                                                </Col>
                                                <Col md="6">
                                                    <div className='mb-2'>
                                                        <Label>Role</Label>
                                                        <select
                                                            className={`form-control ${classnames({ 'is-invalid': errors.role })}`}
                                                            {...register('role', { required: true })}
                                                            onChange={(e) => setSelectedRole(e.target.value)} // Update selectedRole on change
                                                        >
                                                            <option value="">Select a Role</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="client">Client</option>
                                                            <option value="company">Transfer Company</option>
                                                        </select>
                                                        {errors.role && <small className="text-danger">Role is required.</small>}
                                                    </div>
                                                </Col>
                                                {selectedRole === "company" && (
                                                    <Col md="6">
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
                                                    </Col>
                                                )}
                                                <Col md="12">
                                                    <div className='mb-2'>
                                                        <Label>Address</Label>
                                                        <Autocomplete
                                                            className="form-control"
                                                            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                                            onPlaceSelected={(place) => {
                                                                clearErrors('address');
                                                                setAddressObj(place.formatted_address);
                                                            }}
                                                            options={{
                                                                types: ['address'],
                                                                componentRestrictions: { country: 'il' }
                                                            }}
                                                            defaultValue={addressObj || ''} // Set the initial value for address
                                                        />
                                                        {Object.keys(errors).length && errors.address ? <small className="text-danger mt-1">{errors.address.message}</small> : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="mt-4">
                                                <Button color="orange" className="btn-block" type="submit" disabled={isLoading}>
                                                    Submit
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default CompanyProfile;