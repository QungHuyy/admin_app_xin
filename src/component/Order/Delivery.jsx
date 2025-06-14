import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import queryString from 'query-string'

import orderAPI from '../Api/orderAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'

function Delivery(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        status: '2',
        change: true
    })

    const [order, setOrder] = useState([])
    const [totalPage, setTotalPage] = useState()

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const od = await orderAPI.getAPI(query)
            console.log(od)
            setTotalPage(od.totalPage)
            setOrder(od.orders)


        }

        fetchAllData()
    }, [filter])

    const onPageChange = (value) => {
        setFilter({
            ...filter,
            page: value
        })
    }


    const handleConfirm = async (value) => {
        // Hiển thị hộp thoại xác nhận trước khi xác nhận đơn hàng
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xác nhận vận chuyển đơn hàng này không?`);
        
        // Chỉ tiếp tục nếu người dùng đã xác nhận
        if (isConfirmed) {
            const query = '?' + queryString.stringify({ id: value._id })

            const response = await orderAPI.delivery(query)

            if (response.msg === "Thanh Cong") {
                setFilter({
                    ...filter,
                    change: !filter.change
                })
                // Thông báo thành công
                alert("Xác nhận vận chuyển thành công!");
            } else {
                // Thông báo lỗi nếu có
                alert("Có lỗi xảy ra khi xác nhận vận chuyển!");
            }
        }
    }

    const handleCancel = async (value) => {
        // Hiển thị hộp thoại xác nhận trước khi hủy đơn hàng
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng này không?`);
        
        // Chỉ tiếp tục nếu người dùng đã xác nhận
        if (isConfirmed) {
            const query = '?' + queryString.stringify({ id: value._id })

            const response = await orderAPI.cancelOrder(query)

            if (response.msg === "Thanh Cong") {
                setFilter({
                    ...filter,
                    change: !filter.change
                })
                // Thông báo thành công
                alert("Hủy đơn hàng thành công!");
            } else {
                // Thông báo lỗi nếu có
                alert("Có lỗi xảy ra khi hủy đơn hàng!");
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
                                <h4 className="card-title">Vận Chuyển</h4>

                                <div className="table-responsive mt-3">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>Thao tác</th>
                                                <th>ID</th>
                                                <th>Tên</th>
                                                <th>Email</th>
                                                <th>Điện thoại</th>
                                                <th>Địa chỉ</th>
                                                <th>Trạng thái</th>
                                                <th>Tổng tiền</th>
                                                <th>Thanh toán</th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                order && order.map((value, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/order/detail/" + value._id} className="btn btn-info mr-1">Chi tiết</Link>


                                                                <button 
                                                                    type="button" 
                                                                    style={{ cursor: 'pointer', color: 'white' }} 
                                                                    onClick={() => handleConfirm(value)} 
                                                                    className="btn btn-success mr-1" 
                                                                >
                                                                    Xác nhận
                                                                </button>

                                                                {
                                                                    !value.pay && 
                                                                    <button 
                                                                        type="button" 
                                                                        style={{ cursor: 'pointer', color: 'white' }} 
                                                                        onClick={() => handleCancel(value)} 
                                                                        className="btn btn-danger" 
                                                                    >
                                                                        Hủy bỏ
                                                                    </button>
                                                                }  
                                                            </div>
                                                        </td>
                                                        <td className="name">{value._id}</td>
                                                        <td className="name">{value.id_note?.fullname || 'N/A'}</td>
                                                        <td className="name">{value.id_user?.email || 'N/A'}</td>
                                                        <td className="name">{value.id_note?.phone || 'N/A'}</td>
                                                        <td className="name">{value.address}</td>
                                                        <td>
                                                            {(() => {
                                                                switch (value.status) {
                                                                    case "1": return "Đang xử lý";
                                                                    case "2": return "Đã xác nhận";
                                                                    case "3": return "Đang giao";
                                                                    case "4": return "Hoàn thành";
                                                                    default: return "Đơn bị hủy";
                                                                }
                                                            })()}
                                                        </td>
                                                        <td className="name">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(value.total)+ ' VNĐ'}</td>
                                                        <td className="name">{value.pay === true ? "Đã thanh toán" : "Chưa thanh toán"}</td>

                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <Pagination filter={filter} onPageChange={onPageChange} totalPage={totalPage} />
                                </div>
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

export default Delivery;
