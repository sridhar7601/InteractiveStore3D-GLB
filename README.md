# 3D Interactive Store

An immersive 3D e-commerce platform built with React and Three.js, featuring admin controls and cloud storage integration.

## 🌟 Features

- **3D Store Environment**: Interactive 3D space with dynamic product placement
- **Admin Panel**: Upload and manage 3D models (GLB files) with position, rotation, and scale controls
- **User Interaction**: Clickable 3D models with detailed view modals
- **E-commerce Functionality**: Shopping cart system with "Add to Cart" feature
- **Responsive Design**: Optimized for various screen sizes
- **Cloud Integration**: Amazon S3 for efficient 3D model storage and retrieval
- **Visual Effects**: Snow fall particle system for enhanced ambiance

## 🛠️ Tech Stack

### Frontend
- React.js
- Three.js with React Three Fiber
- @react-three/drei for 3D helpers
- React Router for navigation
- Axios for API communication
- react-toastify for notifications

### Backend
- Node.js with Express
- Multer for file handling
- Amazon S3 SDK for cloud storage integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- An Amazon S3 bucket for model storage

## 📖 Usage

### Admin Panel
- Access the admin panel at `/admin`
- Upload new 3D models (GLB format)
- Adjust model positions, rotations, and scales
- Update model metadata (price, description)

### User View
- Access the user panel at `/user`
- Browse the 3D store environment
- Click on products to view details
- Add products to cart

## 🔑 Key Aspects Achieved

1. **Tech Stack Integration**:
- Seamless integration of React.js with Three.js and React Three Fiber
- Efficient state management using React Hooks
- Robust backend with Node.js and Express
- Cloud storage solution with Amazon S3

2. **3D Environment and Interaction**:
- Created an interactive 3D store environment
- Implemented OrbitControls for intuitive navigation
- Developed clickable 3D models with detailed view modals

3. **Model Management and Admin Features**:
- Comprehensive admin interface for 3D model management
- CRUD operations for models including position, rotation, scale, and metadata
- Custom admin view to preview user perspective

4. **Custom Components and UI**:
- GlassModal component for model details with frosted glass effect
- ModelPreview component for individual 3D model rendering
- Responsive design ensuring compatibility across devices

5. **Advanced Rendering and Performance**:
- Implemented environment mapping for realistic reflections
- Utilized custom tone mapping and encoding for improved visuals
- Optimized 3D model loading with React Suspense

6. **E-commerce and User Experience**:
- Integrated shopping cart system with "Add to Cart" functionality
- Implemented toast notifications for user feedback
- Added loading indicators for asynchronous operations
- Created a snow fall effect using Three.js particle systems

7. **Backend and Cloud Integration**:
- Deployed Node.js backend on a cloud platform
- Integrated Amazon S3 for efficient 3D model storage and retrieval
- Implemented secure file handling and URL encoding for model access

8. **Future Enhancements**:
- Voice Navigation component (in progress)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/3d-interactive-store/issues).

## 📜 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## 👏 Acknowledgements

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [drei](https://github.com/pmndrs/drei)
- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
