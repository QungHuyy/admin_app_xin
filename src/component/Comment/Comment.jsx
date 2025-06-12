import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Modal, Button } from 'react-bootstrap';

import CommentAPI from '../Api/CommentAPI';
import Pagination from '../Shared/Pagination';
import Search from '../Shared/Search';

function Comment(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '5',
        search: '',
        status: true
    });

    const [comments, setComments] = useState([]);
    const [totalPage, setTotalPage] = useState();
    const [selectedComment, setSelectedComment] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const query = '?' + queryString.stringify(filter);

        const fetchAllData = async () => {
            try {
                // await fetch('http://localhost:8000/api/admin/comment/').then((data)=> console.log(JSON.stringify(data)) )
                const response = await CommentAPI.getComments(query);
                setComments(response.comments);
                setTotalPage(response.totalPage);
            } catch (error) {
                console.error("Error fetching comments:", error);
                alert("Có lỗi xảy ra khi tải danh sách Đánh giá");
            }
        };

        fetchAllData();
    }, [filter]);

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        });
    };

    const handlerSearch = (value) => {
        setFilter({
            ...filter,
            page: '1',
            search: value
        });
    };

    const handleViewUserInfo = async (comment) => {
        try {
            setSelectedComment(comment);
            const response = await CommentAPI.getUserInfo(comment.id_user._id);
            setUserInfo(response);
            setShowUserModal(true);
        } catch (error) {
            console.error("Error fetching user info:", error);
            alert("Có lỗi xảy ra khi tải thông tin người dùng");
        }
    };

    const handleDeleteClick = (comment) => {
        setSelectedComment(comment);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const response = await CommentAPI.deleteComment(selectedComment._id);
            
            if (response.success) {
                setShowDeleteModal(false);
                setFilter({
                    ...filter,
                    status: !filter.status
                });
                alert("Xóa đánh giá thành công");
            } else {
                alert(response.message || "Có lỗi xảy ra khi xóa đánh giá");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Có lỗi xảy ra khi xóa đánh giá");
        }
    };

    // Hàm hiển thị số sao
    const renderStars = (starCount) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < starCount) {
                stars.push(<i key={i} className="fas fa-star text-warning"></i>);
            } else {
                stars.push(<i key={i} className="far fa-star text-warning"></i>);
            }
        }
        return stars;
    };

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Đánh Giá</h4>
                                <Search handlerSearch={handlerSearch} />

                                <div className="table-responsive mt-3">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Người dùng</th>
                                                <th>Sản phẩm</th>
                                                <th>Đánh giá</th>
                                                <th>Nội dung</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comments && comments.map((comment, index) => (
                                                <tr key={index}>
                                                    <td>{comment._id}</td>
                                                    <td>
                                                        {comment.id_user ? comment.id_user.fullname : 'Không có thông tin'}
                                                    </td>
                                                    <td>
                                                        {comment.id_product ? comment.id_product.name_product : 'Không có thông tin'}
                                                    </td>
                                                    <td>
                                                        {renderStars(comment.star)}
                                                    </td>
                                                    <td>
                                                        {comment.content}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <button 
                                                                className="btn btn-info mr-1"
                                                                onClick={() => handleViewUserInfo(comment)}
                                                            >
                                                                Chi tiết
                                                            </button>
                                                            <button 
                                                                className="btn btn-danger"
                                                                onClick={() => handleDeleteClick(comment)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail User */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userInfo ? (
                        <div>
                            <p><strong>Họ tên:</strong> {userInfo.fullname}</p>
                            <p><strong>Email:</strong> {userInfo.email}</p>
                            <p><strong>Số điện thoại:</strong> {userInfo.phone || 'Không có thông tin'}</p>
                            <p><strong>Địa chỉ:</strong> {userInfo.address || 'Không có thông tin'}</p>
                            <hr />
                            <p><strong>Đánh giá:</strong> {selectedComment && renderStars(selectedComment.star)}</p>
                            <p><strong>Nội dung:</strong> {selectedComment && selectedComment.content}</p>
                            <p><strong>Sản phẩm:</strong> {selectedComment && selectedComment.id_product && selectedComment.id_product.name_product}</p>
                        </div>
                    ) : (
                        <p>Đang tải thông tin...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận Delete */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
                    {selectedComment && (
                        <div>
                            <p><strong>Người dùng:</strong> {selectedComment.id_user && selectedComment.id_user.fullname}</p>
                            <p><strong>Sản phẩm:</strong> {selectedComment.id_product && selectedComment.id_product.name_product}</p>
                            <p><strong>Nội dung:</strong> {selectedComment.content}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            
        </div>
    );
}

export default Comment;
