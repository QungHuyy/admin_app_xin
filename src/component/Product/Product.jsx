import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import queryString from 'query-string'

import productAPI from '../Api/productAPI';
import Pagination from '../Shared/Pagination'
import Search from '../Shared/Search'


function Product() {

    const [filter, setFilter] = useState({
        page: '1',
        limit: '5',
        search: '',
        status: true
    })

    const [products, setProducts] = useState([])
    const [totalPage, setTotalPage] = useState()


    useEffect(() => {
        const query = '?' + queryString.stringify(filter)

        const fetchAllData = async () => {
            const response = await productAPI.getAPI(query)
            setProducts(response.products)
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

    const handleDelete = async (value, productName) => {
        // Hiển thị hộp thoại xác nhận trước khi xóa
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?`);
        
        // Chỉ tiếp tục xóa nếu người dùng đã xác nhận
        if (isConfirmed) {
            const data = {
                id: value
            }
            const query = '?' + queryString.stringify(data)

            const response = await productAPI.delete(query)

            if (response.msg === "Thanh Cong") {
                setFilter({
                    ...filter,
                    status: !filter.status
                })
                // Thông báo xóa thành công
                alert("Xóa sản phẩm thành công!");
            } else {
                // Thông báo lỗi nếu có
                alert("Có lỗi xảy ra khi xóa sản phẩm!");
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
                                <h4 className="card-title">Sản Phẩm</h4>
                                <Search handlerSearch={handlerSearch} />

                                <Link to="/product/create" className="btn btn-primary my-3">Tạo mới</Link>

                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên</th>
                                                <th>Giá</th>
                                                <th>Hình ảnh</th>
                                                <th>Mô tả</th>
                                                {/* <th>Producer</th> */}
                                                <th>Danh mục</th>
                                                <th>Số lượng</th>
                                                <th>Giới tính</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                products && products.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="name">{value._id}</td>
                                                        <td className="name">{value.name_product}</td>
                                                        <td>{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(value.price_product)+ ' VNĐ'}</td>
                                                        <td><img src={value.image} alt="" style={{ width: '70px' }} /></td>
                                                        <td className="name" style={{ minWidth: 400,maxWidth:400, }}>
                                                            <p style={{width:"100%",textWrap:"wrap"}}>{value.describe.length>145 ? value.describe.slice(0,145)+"...":value.describe}</p>
                                                            </td>
                                                        <td>{value.id_category ? value.id_category.category : ""}</td>
                                                        <td>{value?.inventory.S  + value?.inventory.M  +value?.inventory.L  }</td>
                                                        <td>{value.gender}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"/product/update/" + value._id} className="btn btn-success mr-1">Cập nhật</Link>
                                                                <button 
                                                                    type="button" 
                                                                    style={{ cursor: 'pointer', color: 'white' }} 
                                                                    onClick={() => handleDelete(value._id, value.name_product)} 
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

export default Product;
