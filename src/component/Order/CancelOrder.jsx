import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import queryString from 'query-string'

import orderAPI from '../Api/orderAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'

function CancelOrder(props) {
    const [filter, setFilter] = useState({
        page: '1',
        limit: '4',
        search: '',
        status: '5'
    })

    const [order, setOrder] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [totalMoney, setTotalMoney] = useState()

    useEffect(() => {
        const query = '?' + queryString.stringify(filter)
        let money = 0;
        const fetchAllData = async () => {
            const od = await orderAPI.getAPI(query)
            console.log(od)
            setTotalPage(od.totalPage)
            setOrder(od.orders)
            setTotalMoney(od.totalMoney)

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

    return (
        <div className="page-wrapper">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Đơn Hàng Hủy</h4>
                                <h4 className="card-title">Tổng tiền: {totalMoney}đ</h4>
                                <Search handlerSearch={handlerSearch} />

                                <div className="table-responsive mt-3">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên</th>
                                                <th>Email</th>
                                                <th>Điện thoại</th>
                                                <th>Địa chỉ</th>
                                                <th>Trạng thái</th>
                                                <th>Tổng tiền</th>
                                                <th>Thanh toán</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                order && order.map((value, index) => (
                                                    <tr key={index}>
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
                                                        <td className="name">{value.total}</td>
                                                        <td className="name">{value.pay === true ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/order/detail/" + value._id} className="btn btn-info mr-1">Chi tiết</Link>

                                                            </div>
                                                        </td>
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
           
        </div>
    );
}

export default CancelOrder;
