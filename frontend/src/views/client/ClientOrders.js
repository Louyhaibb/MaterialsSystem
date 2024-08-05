/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, Badge, CardBody } from "reactstrap";
import { useGetClientOrdersQuery } from "../../redux/api/orderAPI";
import { ChevronDown, Eye, MoreVertical } from "react-feather";
import { getDateFormat } from "../../utils/Utils";
import Select from 'react-select';

const ClientOrders = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Status...' });
    const queryParams = {
        status: currentStatus.value
    }
    const { data: orders, refetch } = useGetClientOrdersQuery(queryParams);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Completed', label: 'Completed' }
    ];

    const handleStatusChange = (data) => {
        setCurrentStatus(data || { value: '', label: 'Status...' });
    };

    const renderStatus = (row) => {
        let badgeColor;
        switch (row.status.toLowerCase()) {
            case 'pending':
                badgeColor = 'warning';
                break;
            case 'completed':
                badgeColor = 'success';
                break;
            case 'approved':
                badgeColor = 'primary';
                break;
            default:
                badgeColor = 'danger';
        }

        return (
            <span className="text-truncate text-capitalize align-middle">
                <Badge color={badgeColor} className="p-2">
                    {row.status}
                </Badge>
            </span>
        );
    };

    const columns = () => [
        {
            name: 'Order Number',
            selector: (row = {}) => row.orderNumber,
            sortable: true
        },
        {
            name: 'Order Date',
            selector: (row = {}) => getDateFormat(row.orderDate),
            sortable: true
        },
        {
            name: 'Total Price',
            selector: (row = {}) => row.totalPrice,
            sortable: true
        },
        {
            name: 'Company',
            selector: (row = {}) => row.company?.name,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row = {}) => row.address || '',
            sortable: true
        },
        {
            name: 'Status',
            cell: (row) => renderStatus(row),
            ignoreRowClick: true,
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
                                <DropdownItem className="w-100" onClick={() => navigate(`/client/orders/detail/${row._id}`)}>
                                    <Eye size={14} className="mr-50" />
                                    <span className="align-middle mx-2">Preview</span>
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
                        <h4 className="main-title">Orders</h4>
                    </Col>
                </Row>
                <Card>
                    <CardBody>
                        <Row className="justify-content-end">
                            <Col md="3" className="d-flex align-items-center">
                                <Select
                                    isClearable
                                    placeholder="Status..."
                                    className="react-select w-100"
                                    classNamePrefix="select"
                                    options={statusOptions}
                                    value={currentStatus}
                                    onChange={(data) => {
                                        handleStatusChange(data);
                                    }}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                    <DataTable
                        title="Orders"
                        data={orders}
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
        </div>
    )
}

export default ClientOrders;