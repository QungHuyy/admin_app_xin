import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import userAPI from '../Api/userAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'

function UserCus(props) {
    const [filter, setFilter] = useState({
        permission: '6087dcb5f269113b3460fce4',
        page: '1',
        limit: '4',
        search: '',
        status: true
    })

    const [users, setUsers] = useState([])
    const [totalPage, setTotalPage] = useState()


    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const response = await userAPI.getAPI(query)
            setUsers(response.users)
            setTotalPage(response.totalPage)
        }
        fetchAllData()
    }, [filter])


    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }

    const handlerSearch = (value) => {
        setFilter({
            ...filter,
            page: '1',
            search: value
        })
    }

    const handleDelete = async (value) => {
        // Hiển thị hộp thoại xác nhận trước khi xóa
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${value.fullname}" không?`);
        
        // Chỉ tiếp tục xóa nếu người dùng đã xác nhận
        if (isConfirmed) {
            const query = '?' + queryString.stringify({ id: value._id })

            const response = await userAPI.delete(query)

            if (response.msg === "Thanh Cong") {
                setFilter({
                    ...filter,
                    status: !filter.status
                })
                // Thông báo xóa thành công
                alert("Xóa khách hàng thành công!");
            } else {
                // Thông báo lỗi nếu có
                alert("Có lỗi xảy ra khi xóa khách hàng!");
            }
        }
    }


    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Khách Hàng</h4>
                                <Search handlerSearch={handlerSearch} />

                                <Link to="/customer/create" className="btn btn-primary my-3">Tạo mới</Link>

                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên</th>
                                                <th>Email</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                users && users.map((value, index) => (
                                                    <tr key={index}>
                                                        <td>{value._id}</td>
                                                        <td>{value.fullname}</td>
                                                        <td>{value.email}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"user/update/" + value._id} className="btn btn-success mr-1">Chi tiết</Link>

                                                                <button 
                                                                    type="button" 
                                                                    style={{ cursor: 'pointer', color: 'white' }} 
                                                                    onClick={() => handleDelete(value)} 
                                                                    className="btn btn-danger" 
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                                </div>
                                <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                            </div>

                        </div>
                    </div>
                </div>


            </div>
            <footer className="footer text-center text-muted">
                 
            </footer>
        </div>
    );
}

export default UserCus;