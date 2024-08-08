/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import { useGetUserQuery } from "../../redux/api/userAPI";
import { useGetReviewsQuery } from "../../redux/api/reviewAPI";
import { useEffect } from "react";
import { Star } from "react-feather";
import FullScreenLoader from "../../components/FullScreenLoader";
import { getDateFormat } from "../../utils/Utils";
import userImg from '../../assets/images/user.png';

const Profile = () => {
    const { id } = useParams();
    const { data: user, isLoading, refetch: refetchUser } = useGetUserQuery(id);
    const { data: reviews, refetch: refetchReviews } = useGetReviewsQuery(id);

    useEffect(() => {
        refetchUser();
        refetchReviews();
    }, []);

    const renderStars = (marks) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <li key={i} className="ratings-list-item me-25">
                    <Star key={i} className={i <= parseFloat(marks) ? 'filled-star' : 'unfilled-star'} style={{ cursor: 'pointer' }} />
                </li>
            );
        }
        return stars;
    };

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-view">
                    <Container>
                        <Card>
                            <CardBody>
                                {user.role === 'company' ? (
                                    <Row className="m-3">
                                        <Col md="4" sm="12">
                                            <div>
                                                <div className="my-3">
                                                    <img src={user.avatar ? user.avatar : userImg} alt="Profile" className="profile-img" />
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Name:</h5>
                                                    <p className="card-text">{user.name}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Email:</h5>
                                                    <p className="card-text">{user.email}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Phone:</h5>
                                                    <p className="card-text">{user.phone}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Business License Number:</h5>
                                                    <p className="card-text">{user.businessLicense}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Joined:</h5>
                                                    <p className="card-text">{getDateFormat(user.createdAt)}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Lives:</h5>
                                                    <p className="card-text">{user.address}</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="8" sm="12">
                                            <div>
                                                <div className="mt-3">
                                                    <h5 className="mb-3">Reviews:</h5>
                                                    {reviews &&
                                                        reviews.map((review, index) => (
                                                            <div key={index} className="my-2">
                                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="avatar me-2">
                                                                            <img src={review.client?.avatar ? review.client?.avatar : userImg} alt="avatar img" height="50" width="50" />
                                                                        </div>
                                                                        <div className="profile-user-info">
                                                                            <h6 className="mb-0">
                                                                                {review.client?.name}
                                                                            </h6>
                                                                            <small className="text-muted">{getDateFormat(review.createdAt)}</small>
                                                                            <div className="item-rating">
                                                                                <ul className="unstyled-list list-inline">
                                                                                    {renderStars(review.rating)}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className="card-text">{review.comment}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Row className="m-3">
                                        <Col md="4" sm="12">
                                            <div>
                                                <div className="my-3">
                                                    <img src={user.avatar ? user.avatar : userImg} alt="Profile" className="profile-img" />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="8" sm="12">
                                            <div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Name:</h5>
                                                    <p className="card-text">{user.name}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Email:</h5>
                                                    <p className="card-text">{user.email}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Phone:</h5>
                                                    <p className="card-text">{user.phone}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Joined:</h5>
                                                    <p className="card-text">{getDateFormat(user.createdAt)}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <h5 className="mb-0">Lives:</h5>
                                                    <p className="card-text">{user.address}</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            )}
        </>
    )
}

export default Profile;
