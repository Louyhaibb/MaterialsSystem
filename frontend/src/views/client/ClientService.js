/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, Badge, Button, CardBody } from "reactstrap";
import { useGetServicesQuery } from "../../redux/api/serviceAPI";
import { ChevronDown, Eye, MoreVertical } from "react-feather";
import { formatDateRange } from "../../utils/Utils";
import Nouislider from 'nouislider-react';
import wNumb from 'wnumb';

const ClientServices = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];

    const [distance, setDistance] = useState([0, 500]);
    const [price, setPrice] = useState([0, 1000]);
    const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);

    const queryParams = {
        distance: distance,
        price: price,
        serviceType: selectedServiceTypes
    };

    const { data: services, refetch } = useGetServicesQuery(queryParams);

    useEffect(() => {
        refetch()
    }, []);

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    }

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleClearFilter = () => {
        setDistance([0, 500]);
        setPrice([0, 1000]);
        setSelectedServiceTypes([]);
    };

    const handleDistanceChange = (values) => {
        setDistance(values.map(value => parseInt(value)));
    };

    const handlePriceChange = (values) => {
        setPrice(values.map(value => parseInt(value)));
    };

    const handleServiceTypeChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        const uniqueSelectedOptions = [...new Set([...selectedServiceTypes, ...selectedOptions])];
        setSelectedServiceTypes(uniqueSelectedOptions);
    };

    const handleRemoveServiceType = (serviceType) => {
        setSelectedServiceTypes(selectedServiceTypes.filter(item => item !== serviceType));
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
                        {row.role !== 'admin' && (
                            <>
                                <UncontrolledDropdown>
                                    <DropdownToggle tag="div" className="btn btn-sm">
                                        <MoreVertical size={14} className="cursor-pointer action-btn" />
                                    </DropdownToggle>
                                    <DropdownMenu end container="body">
                                        <DropdownItem className="w-100" onClick={() => navigate(`/client/services/detail/${row._id}`)}>
                                            <Eye size={14} className="mr-50" />
                                            <span className="align-middle mx-2">View</span>
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
                        <h4 className="main-title">Services</h4>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col md={3}>
                        <Card>
                            <CardBody>
                                <div className="multi-range-distance">
                                    <h6 className="filter-title mb-5">Distance Range</h6>
                                    <div className="my-4">
                                        <Nouislider
                                            className="range-slider mt-2"
                                            start={distance}
                                            connect={true}
                                            tooltips={[true, true]}
                                            format={wNumb({ decimals: 0 })}
                                            range={{ min: 0, max: 500 }}
                                            onChange={handleDistanceChange}
                                        />
                                    </div>
                                </div>
                                <div className="multi-range-price">
                                    <h6 className="filter-title mb-5">Price Range</h6>
                                    <div className="my-4">
                                        <Nouislider
                                            className="range-slider mt-2"
                                            start={price}
                                            connect={true}
                                            tooltips={[true, true]}
                                            format={wNumb({ decimals: 0 })}
                                            range={{ min: 0, max: 1000 }}
                                            onChange={handlePriceChange}
                                        />
                                    </div>
                                </div>
                                <div className="serviceType mb-4">
                                    <h6 className="filter-title">Service Type</h6>
                                    <select
                                        className="form-control"
                                        multiple={true}
                                        onChange={handleServiceTypeChange}
                                    >
                                        <option value="Office">Office</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Small Transfer">Small Transfer</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="History">History</option>
                                    </select>
                                    <div className="selected-services mt-3">
                                        {selectedServiceTypes.map(serviceType => (
                                            <Badge
                                                key={serviceType}
                                                color="primary"
                                                className="m-1"
                                            >
                                                {serviceType}
                                                <Button
                                                    close
                                                    size="sm"
                                                    className="mx-3"
                                                    onClick={() => handleRemoveServiceType(serviceType)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div id="clear-filters">
                                    <Button color="orange" block onClick={handleClearFilter}>
                                        Clear All Filters
                                    </Button>
                                </div>
                            </CardBody>

                        </Card>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <DataTable
                                title="Client Services"
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
                    </Col>
                </Row>

            </Container>
        </div>
    )
}

export default ClientServices;