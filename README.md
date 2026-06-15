# Hệ Thống Đề Xuất Âm Nhạc (Music Recommendation System)

Đây là một hệ thống đề xuất âm nhạc toàn diện, kết hợp cả phương pháp Lọc Cộng Tác Tuần Tự (SASRec) và Lọc Dựa Trên Nội Dung (Content-based Filtering). Hệ thống được xây dựng với các công nghệ hiện đại bao gồm Backend FastAPI, Frontend React và cơ sở dữ liệu MySQL.

## 🚀 Tính Năng Nổi Bật

- **Đề xuất tuần tự (SASRec)**: Dự đoán các bài hát tiếp theo mà người dùng sẽ nghe dựa trên lịch sử nghe nhạc của họ, sử dụng mô hình Self-Attention (Transformer).
- **Đề xuất theo nội dung**: Gợi ý các bài hát tương đồng dựa trên đặc trưng âm thanh và thể loại âm nhạc bằng thuật toán TF-IDF và Cosine Similarity.
- **RESTful API Backend**: Backend hiệu năng cao được xây dựng bằng FastAPI, xử lý các yêu cầu gợi ý từ mô hình và truy vấn dữ liệu nhanh chóng.
- **Frontend Tương Tác**: Giao diện người dùng mượt mà được xây dựng bằng React để khám phá và trải nghiệm các bài hát được đề xuất.

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: Python, FastAPI, SQLAlchemy, PyTorch, Pandas
- **Frontend**: React, Node.js
- **Database**: MySQL
- **Machine Learning**: PyTorch (SASRec), Scikit-Learn (Content-Based)

## 📁 Cấu Trúc Dự Án

- `/backend`: Chứa mã nguồn server FastAPI, kết nối CSDL (`main.py`), và các API endpoints.
  - `/api/content_base`: Chứa mã nguồn cho hệ thống gợi ý dựa trên nội dung.
  - `/api/session_base`: Chứa logic xử lý mô hình SASRec và router tương ứng.
- `/FE`: Mã nguồn giao diện Frontend (React).
- `/model`: Nơi lưu trữ các file trọng số (weights) của mô hình (ví dụ: `sasrec_model.pt`, file từ vựng item2id).
- `/session_base`: Các file Jupyter Notebook dùng để train mô hình và kịch bản xử lý dữ liệu cho SASRec.

## ⚙️ Hướng Dẫn Cài Đặt

### 1. Cơ Sở Dữ Liệu
Thiết lập máy chủ MySQL và import các bảng dữ liệu cần thiết (như `users`, `tracks`, `history`).

### 2. Backend
1. Tạo môi trường ảo (virtual environment) và kích hoạt.
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql torch pandas scikit-learn
   ```
3. Cập nhật thông tin kết nối CSDL trong file `backend/api/main.py`.
4. Khởi chạy server FastAPI:
   ```bash
   uvicorn backend.api.main:app --reload
   ```

### 3. Frontend
1. Di chuyển vào thư mục `/FE/music-rs-app`.
2. Cài đặt các module của Node:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển của React:
   ```bash
   npm start
   ```

## 📊 Đánh Giá Mô Hình
Mô hình SASRec được đánh giá bằng các thang đo Hit@K, NDCG@K, Precision@K và Recall@K. Các kịch bản test (như `evaluate_sasrec_external.py`) được cung cấp để đo lường hiệu quả của mô hình trên các tập dữ liệu lịch sử nghe nhạc bên ngoài.
