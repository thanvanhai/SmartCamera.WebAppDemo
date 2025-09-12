# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

#run
npm run dev

```
SmartCamera.WebAppDemo/
├── src/
│   ├── components/
│   │   ├── VideoFeed.jsx           # Hiển thị video trực tiếp với lớp phủ AI
│   │   ├── MetricCard.jsx          # Thẻ hiển thị các chỉ số, thông tin
│   │   ├── CameraControlPanel.jsx  # Bảng điều khiển camera và các chức năng AI
│   │   ├── CameraModal.jsx         # Modal để thêm hoặc chỉnh sửa camera
│   │   └── CameraCard.jsx          # Thẻ hiển thị thông tin tóm tắt của một camera
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx           # Trang tổng quan (Dashboard)
│   │   └── CameraList.jsx          # Trang quản lý danh sách camera
│   │
│   ├── services/
│   │   └── apiClient.js            # Cấu hình và quản lý các API call bằng axios
│   │
│   └── App.jsx                     # Component gốc của ứng dụng
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```