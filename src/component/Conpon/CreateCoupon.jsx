import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import CouponAPI from '../Api/CouponAPI';

const defaultValues = {
    code: '',
    count: '',
    promotion: '',
    describe: ''
};

function CreateCoupon(props) {

    const [showMessage, setShowMessage] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });
    const onSubmit = async (data) => {
        try {
            const body = {
                code: data.code,
                count: data.count,
                promotion: data.promotion,
                describe: data.describe
            }

            const response = await CouponAPI.postCoupons(body)

            setShowMessage(response.msg)

            // Chỉ reset form khi thêm thành công
            if (response.msg === "Bạn đã thêm thành công") {
                reset({
                    code: '',
                    count: '',
                    promotion: '',
                    describe: ''
                })
            }
        } catch (error) {
            console.error("Error creating coupon:", error)

            // Kiểm tra nếu là lỗi 400 (Bad Request) - mã đã tồn tại
            if (error.response && error.response.status === 400) {
                setShowMessage(error.response.data.msg || "Mã giảm giá này đã tồn tại, vui lòng chọn mã khác")
            } else {
                setShowMessage("Đã xảy ra lỗi khi tạo mã giảm giá")
            }
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Thêm mã giảm giá</h4>
                                {
                                    showMessage === "Bạn đã thêm thành công" ?
                                        (
                                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                {showMessage}
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                        ) :
                                        (
                                            <p className="form-text text-danger">{showMessage}</p>
                                        )
                                }


                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group w-50">
                                        <label htmlFor="name">Mã Code</label>
                                        <input type="text" className="form-control" id="code" {...register('code', { required: true })} />
                                        {errors.code && errors.code.type === "required" && <p className="form-text text-danger">Mã Code không được để trống</p>}
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="price">Số lượng</label>
                                        <input type="text" className="form-control" id="count" {...register('count', { required: true })} />
                                        {errors.count && errors.count.type === "required" && <p className="form-text text-danger">Số lượng không được để trống</p>}
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Khuyến Mãi</label>
                                        <input type="text" className="form-control" id="promotion" {...register('promotion', { required: true })} />
                                        {errors.promotion && errors.promotion.type === "required" && <p className="form-text text-danger">Khuyến mãi không được để trống</p>}
                                    </div>
                                    <div className="form-group w-50">
                                        <label htmlFor="description">Mô tả</label>
                                        <input type="text" className="form-control" id="describe" {...register('describe', { required: true })} />
                                        {errors.describe && errors.describe.type === "required" && <p className="form-text text-danger">Mô tả không được để trống</p>}
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Coupon</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CreateCoupon;