# Lavago API Postman Collection

This directory contains a comprehensive Postman collection for the Lavago API, which includes all available endpoints organized by feature.

## Files

- `lavago-api.postman_collection.json` - The complete Postman collection
- `generate-postman-collection.js` - Script to regenerate the collection from the codebase

## How to Import

1. Open Postman
2. Click "Import" button
3. Select the `lavago-api.postman_collection.json` file
4. The collection will be imported with all endpoints organized by feature

## Collection Structure

The collection is organized into the following sections:

### Health
- **Health Check** - Check if the API is running

### Authentication
- **Send OTP** - Send OTP to a phone number
- **Check OTP** - Verify OTP and get authentication token

### Admin API
All admin endpoints are prefixed with `/admin/v1/` and include:

#### Core Features
- **Users** - User management (CRUD operations)
- **Addresses** - Address management
- **Vehicles** - Vehicle management
- **Wallets** - Wallet management
- **Bookings** - Booking management
- **Payments** - Payment processing
- **Transactions** - Transaction history
- **Products** - Product catalog
- **Properties** - Property/location management

#### Washer Management
- **Washers** - Washer profiles
- **Washer Hours** - Washer availability schedules
- **Washer Slots** - Time slot management
- **Washer Slot Exceptions** - Exception handling for unavailable slots
- **Washer Products** - Products offered by washers

#### Communication
- **Chats** - Chat room management
- **Chat Messages** - Message handling
- **Chat Users** - Chat participant management

#### Business Features
- **Coupons** - Discount coupon management
- **Referrals** - Referral system
- **Subscriptions** - Subscription management
- **Tickets** - Support ticket system

#### Geofencing
- **Geofencing** - ZIP code availability checks
- **Geofencing Checks** - Geofencing validation
- **Geofencing Cities** - City-based geofencing

#### Nested Resources
- **Booking Actions** - Actions performed on bookings
- **Product Prices** - Pricing for different vehicle types
- **Property Hours** - Operating hours for properties

## Variables

The collection uses two main variables:

### `{{baseUrl}}`
- **Default**: `http://localhost:3000`
- **Purpose**: Base URL for the API
- **How to change**: Edit the collection variables in Postman

### `{{token}}`
- **Default**: Empty
- **Purpose**: Authentication token for protected endpoints
- **Auto-set**: Automatically set when using authentication endpoints

## Authentication

### Automatic Token Management
The authentication endpoints (`Send OTP` and `Check OTP`) automatically set the `{{token}}` variable when a successful response is received. This means:

1. Run "Send OTP" with a valid phone number
2. Run "Check OTP" with the received OTP
3. The token will be automatically set and used for subsequent requests

### Manual Token Management
If you have a token from another source:
1. Open the collection settings
2. Go to the "Variables" tab
3. Set the `token` variable value
4. Save the collection

## Usage Tips

### Testing Workflows
1. **User Registration Flow**:
   - Send OTP → Check OTP → Create User → Create Address → Create Vehicle

2. **Booking Flow**:
   - Get Products → Get Washers → Create Booking → Get Booking Actions

3. **Payment Flow**:
   - Create Payment → Authorize Payment → Confirm Payment

### Path Variables
Many endpoints use path variables (e.g., `:userId`, `:bookingId`). To use these:
1. Click on the request
2. Go to the "Params" tab
3. Fill in the required path variables

### Request Bodies
POST/PUT requests include example request bodies. Modify these according to your needs:
- Replace placeholder IDs with actual values
- Update data according to your test scenarios
- Remove optional fields if not needed

## Regenerating the Collection

If the API routes change, you can regenerate the collection:

```bash
cd docs
node generate-postman-collection.js
```

This will update the `lavago-api.postman_collection.json` file with the latest routes from the codebase.

## Environment Setup

For different environments, create environment variables in Postman:

### Development
- `baseUrl`: `http://localhost:3000`

### Staging
- `baseUrl`: `https://staging-api.lavago.com`

### Production
- `baseUrl`: `https://api.lavago.com`

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Make sure the token is set and valid
2. **404 Not Found**: Check if the baseUrl is correct
3. **422 Validation Error**: Review the request body format
4. **500 Server Error**: Check server logs for details

### Getting Help
- Check the API documentation for endpoint details
- Review the request/response examples in the collection
- Use the Health Check endpoint to verify API availability

## Collection Features

- **Automatic Authentication**: Token management for auth endpoints
- **Organized Structure**: Logical grouping by feature
- **Example Data**: Pre-filled request bodies with realistic data
- **Path Variables**: Easy parameter management
- **Bearer Token Auth**: Automatic token inclusion in requests 