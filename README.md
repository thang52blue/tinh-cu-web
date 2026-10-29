# Trang video "Tình cũ"

Trang tĩnh, gồm `index.html` và `tinh-cu.mp4`, cộng một API nhỏ `api/visit.js` ghi lại người xem đến từ đâu.

## Deploy lên Vercel

```bash
cd web
npx vercel        # lần đầu: đăng nhập, chọn tạo project mới, giữ cài đặt mặc định
npx vercel --prod # đưa lên link chính thức
```

## Xem người xem đến từ đâu

- **Analytics:** Vercel → project → tab *Analytics* → bấm *Enable*. Có bảng theo quốc gia, nguồn truy cập (Facebook, Zalo…) và thiết bị.
- **Logs:** Vercel → project → tab *Logs*, lọc theo `visit`. Mỗi lượt xem có quốc gia, tỉnh/thành, nguồn truy cập và loại thiết bị.

Vị trí được Vercel tự đoán từ địa chỉ IP, chỉ gần đúng ở mức tỉnh/thành (nếu dùng 4G thì có khi lệch sang tỉnh khác). Người xem không bị hỏi quyền gì.
