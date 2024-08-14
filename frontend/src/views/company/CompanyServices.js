/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from "reactstrap";
import { useDeleteServiceMutation, useGetServicesQuery } from "../../redux/api/serviceAPI";
import { ChevronDown, Edit, MoreVertical, Trash2 } from "react-feather";
import { formatDateRange } from "../../utils/Utils"; // You should create this utility function

const CompanyServices = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: services, refetch } = useGetServicesQuery();
    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [deleteService, { isLoading, isError, error, isSuccess, data }] = useDeleteServiceMutation();

    useEffect(() => {
        refetch();
    }, []);

    const openDeleteModal = (serviceId) => {
        setSelectedServiceId(serviceId);
        setModalVisibility(true);
    };

    const handleDeleteService = (id) => {
        deleteService(id);
        setModalVisibility(false);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

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

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const columns = () => [
        {
            name: 'Service Type',
            selector: (row = {}) => (
                <Badge color="primary" className="p-2">
                    {capitalizeFirstLetter(row.serviceType || '')}
                </Badge>
            ),
            sortable: true
        },
        {
            name: 'Description',
            selector: (row = {}) => truncateText(row.description, 100),
            sortable: true
        },
        {
            name: 'Base Price',
            width: '120px',
            selector: (row = {}) => `${row.basePrice}`,
            sortable: true
        },
        {
            name: 'Availability',
            selector: (row = {}) => formatDateRange(row.availability) || '',
            sortable: true
        },
        {
            name: 'Address',
            selector: (row = {}) => row.address || '',
            sortable: true
        },

        {
            name: 'Actions',
            width: '120px',
            cell: (row) => {
                return (
                    <>
                        <UncontrolledDropdown>
                            <DropdownToggle tag="div" className="btn btn-sm">
                                <MoreVertical size={14} className="cursor-pointer action-btn" />
                            </DropdownToggle>
                            <DropdownMenu end container="body">
                                <DropdownItem className="w-100" onClick={() => navigate(`/company/services/update-service/${row._id}`)}>
                                    <Edit size={14} className="mr-50" />
                                    <span className="align-middle mx-2">Update</span>
                                </DropdownItem>
                                <DropdownItem className="w-100" onClick={() => openDeleteModal(row._id)}>
                                    <Trash2 size={14} className="mr-50" />
                                    <span className="align-middle mx-2">Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </>
                );
            }
        }
    ];

    return (
        <div className="main-view">
            <Container>
                <Row className="my-3">
                    <Col>
                        <h4 className="main-title">Company Services</h4>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <a href="/company/services/create-service" className="btn btn-orange btn-sm">Create Service</a>
                    </Col>
                </Row>
                <Card>
                    <DataTable
                        title="Services"
                        data={services}
                        responsive
                        className="react-dataTable"
                        noHeader
                        pagination
                        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                        columns={columns()}
                        sortIcon={<ChevronDown />}
                    />
                </Card>
            </Container>
            <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
                <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Delete?</ModalHeader>
                <ModalBody>Are you sure you want to delete this service?</ModalBody>
                <ModalFooter className="justify-content-start">
                    <Button color="danger" onClick={() => handleDeleteService(selectedServiceId)}>
                        Yes
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default CompanyServices;
