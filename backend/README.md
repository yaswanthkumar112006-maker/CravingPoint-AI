# CravingPoint — Smart Food Delivery System

A full-stack food delivery application developed using **Java, Spring Boot, Spring Security, JWT Authentication, PostgreSQL, and React**.

CravingPoint allows users to securely register and log in, browse restaurants, explore menus, manage their cart, place orders, track orders, and submit reviews.

## Features

### User Features

* User Registration & Login
* JWT-based Authentication
* Secure Protected APIs
* Restaurant Browsing
* Menu Item Browsing
* Cart Management
* Checkout & Order Placement
* Order History
* Order Tracking
* Reviews & Ratings

### Restaurant & Delivery Features

* Restaurant Management
* Menu Item Management
* Order Management
* Delivery Partner Management
* Order Status Management
* Payment Status Management

### Dashboard & Analytics

* Dashboard Analytics
* Monthly Revenue Analytics
* Top Selling Items Analytics

### Backend Features

* RESTful APIs
* Layered Architecture
* Spring Security
* JWT Authentication
* JPA/Hibernate
* PostgreSQL Database
* Global Exception Handling
* DTO-based API design
* API testing with Postman

## Tech Stack

### Backend

* Java 17
* Spring Boot 3.2.5
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* PostgreSQL
* Maven

### Frontend

* React
* JavaScript
* Axios
* Responsive UI

### Tools

* IntelliJ IDEA
* Postman
* Git
* GitHub

## Architecture

The backend follows a layered architecture:

```text
src/main/java/com/smartdelivery/smart_delivery_backend/

├── controller
├── service
├── repository
├── entity
├── dto
├── security
└── exception
```

### Request Flow

```text
React Frontend
       ↓
REST API
       ↓
Controller
       ↓
Service
       ↓
Repository
       ↓
PostgreSQL
```

Authentication flow:

```text
User Login
    ↓
Spring Security
    ↓
JWT Generation
    ↓
JWT Token
    ↓
Protected API Request
    ↓
JWT Authentication Filter
    ↓
Authorized Request
```

## Main API Modules

### Authentication

```text
POST /api/users
POST /api/users/login
GET  /api/users/test
```

### Restaurants

```text
GET    /api/restaurants
GET    /api/restaurants/{id}
POST   /api/restaurants
PUT    /api/restaurants/{id}
DELETE /api/restaurants/{id}
```

### Menu Items

```text
GET    /api/menu-items
GET    /api/menu-items/{id}
GET    /api/menu-items/restaurant/{restaurantId}
POST   /api/menu-items/{restaurantId}
DELETE /api/menu-items/{id}
```

### Orders

```text
POST /api/orders/{userId}
GET  /api/orders/{userId}
GET  /api/orders/status/{status}
PUT  /api/orders/{orderId}/{status}
PUT  /api/orders/payment/{orderId}/{paymentStatus}
PUT  /api/orders/cancel/{orderId}
```

### Other Modules

```text
Cart
Reviews
Delivery Partners
Dashboard Analytics
```

## Security

The application uses **Spring Security and JWT authentication**.

Public endpoints include:

```text
/api/users
/api/users/login
```

Protected APIs require a valid JWT Bearer Token.

```text
Authorization: Bearer <JWT_TOKEN>
```

## API Testing

Backend APIs were tested using **Postman**, including:

* User Registration
* User Login
* JWT Authentication
* Protected APIs
* Restaurant APIs
* Menu APIs
* Order APIs
* Other application modules

## Project Status

```text
Backend Development       ✅
JWT Authentication        ✅
Database Integration      ✅
REST APIs                 ✅
API Testing               ✅
React Frontend            ✅
Frontend-Backend          ✅
Integration
GitHub Repository         ✅
```

## Future Enhancements

* Payment Gateway Integration
* Live GPS-based Delivery Tracking
* Email/SMS Notifications
* Cloud Deployment
* Docker Containerization
* Advanced Recommendation System

## GitHub

**GitHub Profile:**
https://github.com/yaswanthkumar112006-maker

**Backend Repository:**
https://github.com/yaswanthkumar112006-maker/food-delivery-backend

## Author

**Yaswanth Kumar**
