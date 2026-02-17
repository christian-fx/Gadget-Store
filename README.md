# Gadget Store Admin Dashboard

A modern, responsive, and powerful admin dashboard for managing an e-commerce gadget store. Built with **Vanilla JavaScript**, **Vite**, **Tailwind CSS**, and backed by **Firebase**.

##  Features

### Dashboard & Analytics
- **Real-time Overview**: Revenue charts, top-selling categories, and key business metrics.
- **Stock Alerts**: Instant visibility into low-stock and out-of-stock items.

###  Product Management
- **Full CRUD**: Create, Read, Update, and Delete products.
- **Image Uploads**: Seamless integration with **Cloudinary** for product images.
- **Rich Details**: Manage pricing, stock, SKUs, and categories.
- **Search & Filter**: Quickly find products by name, SKU, or category.

###  Category Management
- **Organization**: Create and manage product categories.
- **Automation**: Auto-generated slugs and icon suggestions based on category names.
- **Visuals**: Material Symbols integration for category icons.

###  Inventory Control
- **Stock Adjustments**: easy-to-use interface for restocking or correcting inventory counts.
- **Status Tracking**: Visual indicators for "In Stock", "Low Stock", and "Out of Stock".
- **Valuation**: Real-time calculation of total inventory value.

###  Order Management
- **Order Tracking**: Monitor customer orders from "Pending" to "Delivered".
- **Status Updates**: Quickly update order statuses to keep customers informed.

###  Mobile Responsive
- **Mobile-First Design**: Fully functional on smartphones and tablets.
- **Collapsible Sidebar**: Smooth navigation on smaller screens.

##  Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS v4 (PostCSS)
- **Build Tool**: Vite
- **Backend (BaaS)**: Firebase (Firestore, Auth)
- **Image Storage**: Cloudinary
- **Icons**: Material Symbols (Google Fonts)
- **Fonts**: Inter (Google Fonts)

##  Setup & Installation

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd gadget-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory. You will need API keys for Firebase and Cloudinary.
> **Note:** This file is ignored by Git for security.

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 5. Build for Production
To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.

##  Security

- **Environment Variables**: API keys are stored in `.env` and accessed via `import.meta.env`.
- **Firebase Security Rules**: Ensure your Firestore rules are configured to restrict access (e.g., only authenticated admins can write).

## Project Structure

```
gadget-store/
├── src/
│   ├── admin/
│   │   ├── components/   # Reusable UI (Sidebar, Topbar, Modal, Toast)
│   │   ├── pages/        # Page logic (Dashboard, Products, Categories, etc.)
│   │   ├── store/        # Data logic & Firebase interactions
│   │   └── utils/        # Helper functions
│   ├── api/              # Firebase & Cloudinary config
│   ├── assets/           # Static assets
│   ├── styles/           # Global styles & Tailwind directives
│   └── main.js           # Application entry point & routing
├── public/               # Static public assets
├── index.html            # Main HTML entry
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies & scripts
```

##  License

This project is proprietary.
