/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { useDeleteAdditionalServiceMutation, useGetAdditionalServicesQuery } from "../../redux/api/additionalServiceAPI";
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from "reactstrap";
import { ChevronDown, Edit, MoreVertical, Trash2 } from "react-feather";
import { useEffect, useState } from "react";

const AdditionalServices = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: additionalServices, refetch } = useGetAdditionalServicesQuery();
    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [deleteAdditionalService, { isLoading, isError, error, isSuccess, data }] = useDeleteAdditionalServiceMutation();
    useEffect(() => {
        refetch()
    }, []);

    const openDeleteModal = (serviceId) => {
        setSelectedServiceId(serviceId);
        setModalVisibility(true);
    }

    const handleDeleteUser = (id) => {
        deleteAdditionalService(id);
        setModalVisibility(false);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    }

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
    }, [isLoading]);

    const columns = () => [
        {
            name: 'Additional Service Name',
            selector: (row = {}) => (
                <Badge color="primary" className="p-2">
                    {row.serviceName || ''}
                </Badge>
            ),
            sortable: true
        },
        {
            name: 'Service Name',
            selector: (row = {}) => (
                <Badge color="info" className="p-2">
                    {row.service?.serviceType || ''}
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
            name: 'Unit Price',
            selector: (row = {}) => `${row.unitPrice}`,
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
                                <DropdownItem className="w-100" onClick={() => navigate(`/company/additional-services/update-service/${row._id}`)}>
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
                        <h4 className="main-title">Additional Services</h4>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <a href="/company/additional-services/create-service" className="btn btn-orange btn-sm">Create Additional Sevice</a>
                    </Col>
                </Row>
                <Card>
                    <DataTable
                        title="Additional Services"
                        data={additionalServices}
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
                <ModalBody>Are you sure you want to delete?</ModalBody>
                <ModalFooter className="justify-content-start">
                    <Button color="danger" onClick={() => handleDeleteUser(selectedServiceId)}>
                        Yes
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default AdditionalServices;