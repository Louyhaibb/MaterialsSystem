/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery } from "../../redux/api/userAPI";
import DataTable from 'react-data-table-component';
import {
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Input,
    InputGroup,
    InputGroupText,
    Row,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import { ChevronDown, Search, MoreVertical, Trash2, Edit } from 'react-feather';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Users = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const [searchItem, setSearchItem] = useState('');
    const queryParams = {
        q: searchItem,
    };
    const { data: users, refetch } = useGetUsersQuery(queryParams);
    const navigate = useNavigate();
    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [deleteUser, { isLoading, isError, error, isSuccess, data }] = useDeleteUserMutation();
    console.log(users)

    useEffect(() => {
        refetch()
    }, []);

    const renderRole = (row = {}) => {
        const getBadgeColor = (role = '') => {
            switch (role.toLowerCase()) {
                case 'admin':
                    return 'info';
                case 'client':
                    return 'primary';
                case 'company':
                    return 'danger';
                default:
                    return 'danger';
            }
        };

        return (
            <span className="text-truncate text-capitalize align-middle">
                <Badge color={getBadgeColor(row.role)} className="px-3 py-2" pill>
                    {row.role}
                </Badge>
            </span>
        );
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/admin/users');
        }
        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const handleDeleteUser = (id) => {
        deleteUser(id);
        setModalVisibility(false);
    };

    const handleFilter = (q) => {
        setSearchItem(q);
    };

    const openDeleteModal = (userId) => {
        setSelectedUserId(userId);
        setModalVisibility(true);
    }

    // ** Renders Image Columns
    const renderImage = (row) => {
        if (row.avatar) {
            return <img src={row.avatar} alt="avatar" className="img-fluid" style={{ height: '40px', width: 'auto' }} />;
        }
        return (<></>);
    };

    const columns = () => [
        {
            name: '',
            selector: (row) => renderImage(row),
        },
        {
            name: 'Name',
            selector: (row = {}) => row.name || '',
            sortable: true
        },
        {
            name: 'Email',
            selector: (row = {}) => `${row.email}`,
            sortable: true
        },
        {
            name: 'Phone',
            selector: (row = {}) => row.phone || '',
            sortable: true
        },
        {
            name: 'Address',
            selector: (row = {}) => row.address || '',
            sortable: true
        },
        {
            name: 'Business License',
            selector: (row = {}) => row.businessLicense || '',
            sortable: true
        },
        {
            name: 'Role',
            cell: (row) => renderRole(row),
            ignoreRowClick: true,
        },
        {
            name: 'Actions',
            width: '120px',
            cell: (row) => {
                return (
                    <>
                        {row.role !== 'admin' && (
                            <>
                                <UncontrolledDropdown>
                                    <DropdownToggle tag="div" className="btn btn-sm">
                                        <MoreVertical size={14} className="cursor-pointer action-btn" />
                                    </DropdownToggle>
                                    <DropdownMenu end container="body">
                                        <DropdownItem className="w-100" onClick={() => navigate(`/admin/users/update-user/${row._id}`)}>
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
                        )}
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
                        <h4 className="main-title">Users</h4>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <a href="/admin/users/create-user" className="btn btn-outline-primary btn-sm">Create User</a>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row className="justify-content-end">
                            <Col md="3" className="d-flex align-items-center">
                                <InputGroup>
                                    <InputGroupText>
                                        <Search size={14} />
                                    </InputGroupText>
                                    <Input id="search-user" type="text" value={searchItem} onChange={(e) => handleFilter(e.target.value ? e.target.value : '')} />
                                </InputGroup>
                                {searchItem && (
                                    <Button
                                        size="sm"
                                        className="clear-link d-block"
                                        onClick={() => {
                                            handleFilter('');
                                        }}
                                        color="flat-light">
                                        clear
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </CardBody>
                    <DataTable
                        title="Users"
                        data={users}
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
                    <Button color="danger" onClick={() => handleDeleteUser(selectedUserId)}>
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

export default Users;
