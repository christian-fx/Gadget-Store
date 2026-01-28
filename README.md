# Gadget Store

A comprehensive e-commerce platform for selling gadgets and electronics with a powerful admin dashboard for managing products, inventory, customers, and orders.

## Features

### Admin Dashboard
- **Dashboard Overview**: Real-time insights with revenue charts and key metrics
- **Product Management**: Add, edit, delete, and organize gadgets with detailed information
- **Category Management**: Create and manage product categories
- **Inventory Management**: Track stock levels, low stock alerts, and inventory history
- **Order Management**: View and manage customer orders with status tracking
- **Customer Management**: Monitor customer data and purchase history
- **Settings**: Configure store settings and preferences (not configured yet!)

### Core Functionalities
-  **Authentication**: Secure user authentication with Firebase
-  **Product Management**: Complete CRUD operations for products
-  **Analytics**: Revenue charts and sales analytics
-  **Inventory Tracking**: Real-time stock management
-  **Customer Database**: Customer information and order history
-  **Responsive Design**: Mobile-friendly interface
-  **Cloud Storage**: Integration with Cloudinary for image uploads

## Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3 & Tailwind CSS**: Modern styling and responsive design
- **JavaScript (Vanilla)**: Interactive features and DOM manipulation
- **Chart.js**: Data visualization for analytics

### Backend & Services (Coming Soon!!)
- **Firebase**: Authentication and real-time database
- **Firestore**: Cloud database for storing products, orders, and customer data
- **Cloudinary**: Cloud-based image management and optimization

## Project Structure

```
Gadget Store/
├── public/
│   ├── auth.html              # Authentication page
│   └── admin/
│       ├── dashboard.html      # Admin dashboard
│       ├── products.html       # Product management
│       ├── categories.html     # Category management
│       ├── customer.html       # Customer management
│       ├── orders.html         # Order management
│       ├── inventory.html      # Inventory management
│       └── settings.html       # Settings page
├── src/
│   └── js/
│       ├── auth.js            # Authentication logic
│       ├── auth-guard.js       # Route protection
│       ├── services.js/        # Business logic services
│       │   ├── adminAuthService.js
│       │   ├── productService.js
│       │   ├── categoryService.js
│       │   ├── customerService.js
│       │   ├── inventoryService.js
│       │   └── cloudinaryService.js
│       ├── firebase/           # Firebase configuration
│       │   ├── config.js
│       │   ├── auth.js
│       │   └── firestore.js
│       └── admin/             # Admin-specific modules
│           ├── adminGuard.js
│           ├── dashboard.js
│           ├── products.js
│           ├── categories.js
│           ├── customer.js
│           ├── orders.js
│           ├── inventory.js
│           └── settings.js
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gadget-store
   ```

2. **Install dependencies** (if using npm)
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Add your Firebase configuration to `src/js/firebase/config.js`
   - Enable Authentication (Email/Password)
   - Create a Firestore database

4. **Configure Cloudinary**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Add your Cloudinary API credentials to environment variables

5. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add required credentials (Firebase, Cloudinary)

## Usage

### Development
```bash
# Start a local development server
npx http-server
# or use your preferred local server
```

### Accessing the Application
1. Navigate to `public/auth.html` for authentication
2. Log in with admin credentials
3. Access the dashboard at `public/admin/dashboard.html`

### Admin Operations

#### Products
- View all products with filtering and search
- Add new products with details and images
- Edit product information
- Delete products
- Track product inventory

#### Categories
- Create new product categories
- Edit category details
- Manage category organization
- View products by category

#### Orders (coming soon!!)
- View all customer orders
- Track order status (pending, processing, shipped, delivered)
- Manage order fulfillment

#### Customers (coming soon)
- View customer profiles
- Track customer purchase history
- Monitor customer spending
- Customer analytics

#### Inventory
- Monitor stock levels
- Set low stock thresholds
- View inventory history
- Track stock movements

## Environment Variables

Create a `.env` file with the following variables:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Security Considerations

- **Authentication**: All admin routes are protected by authentication guards
- **Firebase Rules**: Set up proper Firestore security rules
- **Sensitive Files**: Firebase config and services are added to `.gitignore`
- **Input Validation**: Always validate user inputs on both client and server
- **HTTPS**: Use HTTPS in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Email notifications for orders
- [ ] SMS alerts for low stock
- [ ] Customer reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Bulk product import/export
- [ ] Multi-currency support

## License

This project is proprietary and confidential.

## Support

For issues, bugs, or feature requests, please contact the development team.

---

**Last Updated**: January 2026
