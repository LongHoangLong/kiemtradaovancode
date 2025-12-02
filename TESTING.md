# Quy Trình Kiểm Thử Ứng Dụng Kiểm Tra Đạo Văn Code

Tài liệu này mô tả quy trình kiểm thử thủ công cho ứng dụng, đảm bảo các chức năng hoạt động đúng và mang lại trải nghiệm tốt cho người dùng.

## 1. Mục Tiêu Kiểm Thử

- Đảm bảo chức năng phân tích đạo văn hoạt động chính xác.
- Đảm bảo giao diện người dùng (UI) hiển thị đúng, trực quan và dễ sử dụng.
- Đảm bảo tính năng lịch sử (lưu, xem, xóa) hoạt động ổn định.
- Đảm bảo ứng dụng hoạt động tốt trên các trình duyệt và kích thước màn hình phổ biến.

## 2. Các Trường Hợp Kiểm Thử (Test Cases)

### 2.1. Chức Năng Tải Lên và Phân Tích

| ID | Mô Tả | Các Bước Thực Hiện | Kết Quả Mong Muốn |
| :-- | :--- | :--- | :--- |
| **TC-01** | Tải lên tệp .zip hợp lệ | 1. Mở trang chủ. <br> 2. Kéo thả hoặc nhấp để chọn một tệp `.zip` chứa các tệp mã nguồn. | Tên tệp được hiển thị. Nút "Phân tích" được kích hoạt. |
| **TC-02** | Tải lên tệp không hợp lệ | 1. Mở trang chủ. <br> 2. Chọn một tệp không phải `.zip` hoặc `.rar` (ví dụ: `.txt`, `.jpg`). | Ứng dụng không nhận tệp, không có tên tệp nào được hiển thị. Nút "Phân tích" vẫn bị vô hiệu hóa. |
| **TC-03** | Hủy chọn tệp | 1. Tải lên một tệp hợp lệ. <br> 2. Nhấp vào nút `X` bên cạnh tên tệp. | Tên tệp biến mất. Khu vực tải lên quay về trạng thái ban đầu. Nút "Phân tích" bị vô hiệu hóa. |
| **TC-04** | Chạy phân tích thành công | 1. Tải lên một tệp `.zip` hợp lệ có chứa ít nhất 2 tệp mã nguồn. <br> 2. Nhấp nút "Phân tích". | Màn hình "Đang phân tích..." hiển thị. Sau khi hoàn tất, báo cáo phân tích xuất hiện với các thông số, danh sách chi tiết và ma trận tương đồng. |
| **TC-05**| Chạy phân tích với tệp zip ít hơn 2 tệp | 1. Tải lên tệp `.zip` chỉ chứa 1 tệp. <br> 2. Nhấp nút "Phân tích". | Hiển thị thông báo lỗi "The zip file must contain at least two files to compare." |
| **TC-06** | Gom nhóm ma trận | 1. Chạy phân tích với file có tên dạng `tenbai-tensv`. <br> 2. Trong báo cáo, vào tab "Ma trận tương đồng". <br> 3. Sử dụng bộ lọc để gom nhóm theo tên bài hoặc tên sinh viên. | Ma trận hiển thị đúng theo lựa chọn gom nhóm. |

### 2.2. Chức Năng Báo Cáo và So Sánh

| ID | Mô Tả | Các Bước Thực Hiện | Kết Quả Mong Muốn |
| :-- | :--- | :--- | :--- |
| **TC-07** | Xem chi tiết so sánh | 1. Trong báo cáo, nhấp nút "View Details" ở một cặp tệp. | Chuyển đến màn hình so sánh chi tiết. Hiển thị đúng % tương đồng, tên hai tệp, và mã nguồn song song. |
| **TC-08** | Highlight code giống nhau | 1. Tại màn hình so sánh chi tiết. | Những đoạn code giống hệt nhau giữa hai tệp được tô nền màu vàng. Cấu trúc code (xuống dòng, thụt lề) được giữ nguyên. |
| **TC-09** | Quay lại từ màn hình chi tiết | 1. Tại màn hình so sánh chi tiết, nhấp nút "Back to analysis". | Quay trở lại màn hình báo cáo tổng quan. |

### 2.3. Chức Năng Lịch Sử

| ID | Mô Tả | Các Bước Thực Hiện | Kết Quả Mong Muốn |
| :-- | :--- | :--- | :--- |
| **TC-10** | Lưu lịch sử sau khi phân tích | 1. Chạy phân tích thành công. | Một mục mới xuất hiện trong danh sách "Analysis History" với đúng tên tệp và thời gian. |
| **TC-11** | Xem lại báo cáo từ lịch sử | 1. Trên trang chủ, nhấp nút "View Report" của một mục trong lịch sử. | Hiển thị lại màn hình báo cáo phân tích tương ứng với mục đã chọn. |
| **TC-12** | Xóa một mục lịch sử | 1. Nhấp vào biểu tượng thùng rác ở một dòng lịch sử. <br> 2. Nhấp "Confirm" trong hộp thoại. | Dòng lịch sử đó biến mất khỏi danh sách và `localStorage`. |
| **TC-13** | Xóa toàn bộ lịch sử (với xác nhận) | 1. Nhấp nút "Clear History". <br> 2. Nhấp "Confirm" trong hộp thoại xác nhận. | Toàn bộ danh sách lịch sử biến mất. |
| **TC-14** | Hủy xóa toàn bộ lịch sử | 1. Nhấp nút "Clear History". <br> 2. Nhấp "Cancel" trong hộp thoại xác nhận. | Hộp thoại đóng lại, danh sách lịch sử không thay đổi. |

### 2.4. Giao Diện Người Dùng và Trải Nghiệm

| ID | Mô Tả | Các Bước Thực Hiện | Kết Quả Mong Muốn |
| :-- | :--- | :--- | :--- |
| **TC-15** | Đa ngôn ngữ | 1. Sử dụng bộ chọn ngôn ngữ để chuyển giữa Tiếng Anh và Tiếng Việt. | Toàn bộ nội dung trên trang (tiêu đề, nút bấm, mô tả) thay đổi tương ứng với ngôn ngữ đã chọn. |
| **TC-16** | Hiển thị trên di động | 1. Mở ứng dụng trên trình duyệt di động hoặc co nhỏ cửa sổ trình duyệt trên máy tính. | Giao diện tự động điều chỉnh hợp lý, không có thành phần nào bị vỡ hoặc che khuất. |

## 3. Môi Trường Kiểm Thử

- **Trình duyệt:**
  - Google Chrome (Phiên bản mới nhất)
  - Mozilla Firefox (Phiên bản mới nhất)
  - Microsoft Edge (Phiên bản mới nhất)
- **Thiết bị:**
  - Máy tính để bàn (Desktop)
  - Thiết bị di động (Mô phỏng hoặc thực tế)
