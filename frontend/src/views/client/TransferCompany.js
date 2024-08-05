/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import DataTable from 'react-data-table-component';
import { useGetUsersQuery } from "../../redux/api/userAPI";
import { Card, Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { ChevronDown, Eye, MoreVertical } from "react-feather";
import { useNavigate } from "react-router-dom";
import companyImg from "../../assets/images/company.png";

const TransferCompany = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const queryParams = {
        role: 'company',
    };
    const { data: companies, refetch } = useGetUsersQuery(queryParams);
    useEffect(() => {
        refetch()
    }, []);

    // ** Renders Image Columns
    const renderImage = (row) => {
        if (row.avatar) {
            return <img src={row.avatar} alt="avatar" className="img-fluid" style={{ height: '40px', width: 'auto' }} />;
        }
        return <img src={companyImg} alt="avatar" className="img-fluid" style={{ height: '40px', width: 'auto' }} />;
    };

    const columns = () => [
        {
            name: 'Icon',
            selector: (row) => renderImage(row),
        },
        {
            name: 'Company Name',
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
                                <DropdownItem className="w-100" onClick={() => navigate(`/client/companies/order-request/${row._id}`)}>
                                    <Eye size={14} className="mr-50" />
                                    <span className="align-middle mx-2">Order</span>
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
                        <h4 className="main-title">Transfer Company</h4>
                    </Col>
                </Row>
                <Card>
                    <DataTable
                        title="Transfer Company"
                        data={companies}
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

export default TransferCompany;