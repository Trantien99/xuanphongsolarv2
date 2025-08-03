export enum OrderStatusEnum {
    // Chờ xử lý
    PENDING = 'PENDING',
    // Đang xử lý
    PROCESSING = 'PROCESSING',
    // Đang giao
    DELIVERING = 'DELIVERING',
    // Đa hoàn thành
    SUCCESS = 'SUCCESS',
    // Đa huy
    CANCEL = 'CANCEL',
    // Đang hoàn lại
    REFUND = 'REFUND',
    // Hoàn lại thành công
    REFUND_SUCCESS = 'REFUND_SUCCESS',
    // Hoàn lại thất bại
    REFUND_FAIL = 'REFUND_FAIL'
}