const fs = require('fs');

// Define all the API routes based on the codebase analysis
const routes = {
	health: [
		{ method: 'GET', path: '/health', name: 'Health Check' }
	],
	auth: [
		{ method: 'POST', path: '/auth/otp/send', name: 'Send OTP', body: { phone: '+1234567890' } },
		{ method: 'POST', path: '/auth/otp/check', name: 'Check OTP', body: { phone: '+1234567890', otp: '123456' } }
	],
	admin: {
		status: [
			{ method: 'GET', path: '/admin/v1', name: 'Admin Status' }
		],
		users: [
			{ method: 'GET', path: '/admin/v1/users', name: 'Get All Users' },
			{ method: 'GET', path: '/admin/v1/users/:userId', name: 'Get User by ID' },
			{ method: 'GET', path: '/admin/v1/users/email/:email', name: 'Get User by Email' },
			{ method: 'GET', path: '/admin/v1/users/phone/:phone', name: 'Get User by Phone' },
			{ method: 'POST', path: '/admin/v1/users', name: 'Create User', body: { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' } },
			{ method: 'PUT', path: '/admin/v1/users/:userId', name: 'Update User', body: { name: 'John Doe Updated', email: 'john.updated@example.com' } },
			{ method: 'DELETE', path: '/admin/v1/users/:userId', name: 'Delete User' },
			{ method: 'PATCH', path: '/admin/v1/users/otp/update/:phone', name: 'Update OTP by Phone', body: { otp: '123456' } },
			{ method: 'POST', path: '/admin/v1/users/otp/check', name: 'Check OTP', body: { phone: '+1234567890', otp: '123456' } }
		],
		addresses: [
			{ method: 'GET', path: '/admin/v1/addresses', name: 'Get All Addresses' },
			{ method: 'GET', path: '/admin/v1/addresses/:addressId', name: 'Get Address by ID' },
			{ method: 'GET', path: '/admin/v1/addresses/user/:userId', name: 'Get Addresses by User ID' },
			{ method: 'POST', path: '/admin/v1/addresses', name: 'Create Address', body: { userId: 'user-id', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001' } },
			{ method: 'PUT', path: '/admin/v1/addresses/:addressId', name: 'Update Address', body: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90210' } },
			{ method: 'DELETE', path: '/admin/v1/addresses/:addressId', name: 'Delete Address' }
		],
		vehicles: [
			{ method: 'GET', path: '/admin/v1/vehicles', name: 'Get All Vehicles' },
			{ method: 'GET', path: '/admin/v1/vehicles/:vehicleId', name: 'Get Vehicle by ID' },
			{ method: 'GET', path: '/admin/v1/vehicles/user/:userId', name: 'Get Vehicles by User ID' },
			{ method: 'POST', path: '/admin/v1/vehicles', name: 'Create Vehicle', body: { userId: 'user-id', brand: 'Toyota', model: 'Camry', year: 2020, color: 'White', licensePlate: 'ABC123' } },
			{ method: 'PUT', path: '/admin/v1/vehicles/:vehicleId', name: 'Update Vehicle', body: { brand: 'Honda', model: 'Civic', year: 2021, color: 'Blue', licensePlate: 'XYZ789' } },
			{ method: 'DELETE', path: '/admin/v1/vehicles/:vehicleId', name: 'Delete Vehicle' }
		],
		wallets: [
			{ method: 'GET', path: '/admin/v1/wallets', name: 'Get All Wallets' },
			{ method: 'GET', path: '/admin/v1/wallets/:walletId', name: 'Get Wallet by ID' },
			{ method: 'GET', path: '/admin/v1/wallets/user/:userId', name: 'Get Wallet by User ID' },
			{ method: 'POST', path: '/admin/v1/wallets', name: 'Create Wallet', body: { userId: 'user-id', balance: 100.00 } },
			{ method: 'PUT', path: '/admin/v1/wallets/:walletId', name: 'Update Wallet', body: { balance: 150.00 } },
			{ method: 'DELETE', path: '/admin/v1/wallets/:walletId', name: 'Delete Wallet' }
		],
		bookings: [
			{ method: 'GET', path: '/admin/v1/bookings', name: 'Get All Bookings' },
			{ method: 'GET', path: '/admin/v1/bookings/:bookingId', name: 'Get Booking by ID' },
			{ method: 'GET', path: '/admin/v1/bookings/client/:clientId', name: 'Get Bookings by Client ID' },
			{ method: 'GET', path: '/admin/v1/bookings/washer/:washerId', name: 'Get Bookings by Washer ID' },
			{ method: 'POST', path: '/admin/v1/bookings', name: 'Create Booking', body: { clientId: 'client-id', washerId: 'washer-id', vehicleId: 'vehicle-id', serviceType: 'basic' } },
			{ method: 'PUT', path: '/admin/v1/bookings/:bookingId', name: 'Update Booking', body: { status: 'confirmed', scheduledTime: '2024-01-01T10:00:00Z' } },
			{ method: 'DELETE', path: '/admin/v1/bookings/:bookingId', name: 'Delete Booking' }
		],
		bookingActions: [
			{ method: 'GET', path: '/admin/v1/bookings/:bookingId/actions', name: 'Get Booking Actions by Booking ID' },
			{ method: 'GET', path: '/admin/v1/bookings/:bookingId/actions/:bookingActionId', name: 'Get Booking Action by ID' },
			{ method: 'POST', path: '/admin/v1/bookings/:bookingId/actions', name: 'Create Booking Action', body: { action: 'started', notes: 'Service started' } },
			{ method: 'PUT', path: '/admin/v1/bookings/:bookingId/actions/:bookingActionId', name: 'Update Booking Action', body: { action: 'completed', notes: 'Service completed' } },
			{ method: 'DELETE', path: '/admin/v1/bookings/:bookingId/actions/:bookingActionId', name: 'Delete Booking Action' }
		],
		payments: [
			{ method: 'GET', path: '/admin/v1/payments', name: 'Get All Payments' },
			{ method: 'GET', path: '/admin/v1/payments/:paymentId', name: 'Get Payment by ID' },
			{ method: 'GET', path: '/admin/v1/payments/user/:userId', name: 'Get Payments by User ID' },
			{ method: 'GET', path: '/admin/v1/payments/provider/:paymentProviderId', name: 'Get Payment by Provider ID' },
			{ method: 'POST', path: '/admin/v1/payments', name: 'Create Payment', body: { userId: 'user-id', amount: 50.00, currency: 'USD', provider: 'stripe' } },
			{ method: 'PUT', path: '/admin/v1/payments/:paymentId', name: 'Update Payment', body: { status: 'pending' } },
			{ method: 'PUT', path: '/admin/v1/payments/:paymentId/authorize', name: 'Authorize Payment' },
			{ method: 'PUT', path: '/admin/v1/payments/:paymentId/confirm', name: 'Confirm Payment' },
			{ method: 'PUT', path: '/admin/v1/payments/:paymentId/fail', name: 'Fail Payment' },
			{ method: 'PUT', path: '/admin/v1/payments/:paymentId/refund', name: 'Refund Payment' },
			{ method: 'PUT', path: '/admin/v1/payments/:paymentId/cancel', name: 'Cancel Payment' },
			{ method: 'DELETE', path: '/admin/v1/payments/:paymentId', name: 'Delete Payment' }
		],
		transactions: [
			{ method: 'GET', path: '/admin/v1/transactions', name: 'Get All Transactions' },
			{ method: 'GET', path: '/admin/v1/transactions/:transactionId', name: 'Get Transaction by ID' },
			{ method: 'GET', path: '/admin/v1/transactions/user/:userId', name: 'Get Transactions by User ID' },
			{ method: 'GET', path: '/admin/v1/transactions/object/:object/:objectId', name: 'Get Transactions by Object' },
			{ method: 'POST', path: '/admin/v1/transactions', name: 'Create Transaction', body: { userId: 'user-id', amount: 25.00, type: 'credit', description: 'Wallet top-up' } },
			{ method: 'PUT', path: '/admin/v1/transactions/:transactionId', name: 'Update Transaction', body: { status: 'completed' } },
			{ method: 'DELETE', path: '/admin/v1/transactions/:transactionId', name: 'Delete Transaction' }
		],
		products: [
			{ method: 'GET', path: '/admin/v1/products', name: 'Get All Products' },
			{ method: 'GET', path: '/admin/v1/products/:productId', name: 'Get Product by ID' },
			{ method: 'POST', path: '/admin/v1/products', name: 'Create Product', body: { name: 'Basic Wash', description: 'Basic car wash service', price: 25.00 } },
			{ method: 'PUT', path: '/admin/v1/products/:productId', name: 'Update Product', body: { name: 'Premium Wash', description: 'Premium car wash service', price: 35.00 } },
			{ method: 'DELETE', path: '/admin/v1/products/:productId', name: 'Delete Product' }
		],
		productPrices: [
			{ method: 'GET', path: '/admin/v1/products/:productId/prices', name: 'Get Product Prices by Product ID' },
			{ method: 'GET', path: '/admin/v1/products/:productId/prices/:productPriceId', name: 'Get Product Price by ID' },
			{ method: 'GET', path: '/admin/v1/products/:productId/prices/vehicle/:vehicleType', name: 'Get Product Price by Vehicle Type' },
			{ method: 'POST', path: '/admin/v1/products/:productId/prices', name: 'Create Product Price', body: { vehicleType: 'sedan', price: 25.00 } },
			{ method: 'PUT', path: '/admin/v1/products/:productId/prices/:productPriceId', name: 'Update Product Price', body: { price: 30.00 } },
			{ method: 'DELETE', path: '/admin/v1/products/:productId/prices/:productPriceId', name: 'Delete Product Price' }
		],
		properties: [
			{ method: 'GET', path: '/admin/v1/properties', name: 'Get All Properties' },
			{ method: 'GET', path: '/admin/v1/properties/:propertyId', name: 'Get Property by ID' },
			{ method: 'GET', path: '/admin/v1/properties/zip/:zip', name: 'Get Properties by ZIP' },
			{ method: 'POST', path: '/admin/v1/properties', name: 'Create Property', body: { name: 'Downtown Location', address: '123 Main St', city: 'New York', zipCode: '10001' } },
			{ method: 'PUT', path: '/admin/v1/properties/:propertyId', name: 'Update Property', body: { name: 'Updated Location', address: '456 Oak Ave' } },
			{ method: 'DELETE', path: '/admin/v1/properties/:propertyId', name: 'Delete Property' }
		],
		propertyHours: [
			{ method: 'GET', path: '/admin/v1/properties/:propertyId/hours', name: 'Get Property Hours by Property ID' },
			{ method: 'GET', path: '/admin/v1/properties/:propertyId/hours/:propertyHourId', name: 'Get Property Hour by ID' },
			{ method: 'GET', path: '/admin/v1/properties/:propertyId/hours/day/:dayOfWeek', name: 'Get Property Hours by Day' },
			{ method: 'POST', path: '/admin/v1/properties/:propertyId/hours', name: 'Create Property Hour', body: { dayOfWeek: 'monday', openTime: '09:00', closeTime: '17:00' } },
			{ method: 'PUT', path: '/admin/v1/properties/:propertyId/hours/:propertyHourId', name: 'Update Property Hour', body: { openTime: '08:00', closeTime: '18:00' } },
			{ method: 'DELETE', path: '/admin/v1/properties/:propertyId/hours/:propertyHourId', name: 'Delete Property Hour' }
		],
		washers: [
			{ method: 'GET', path: '/admin/v1/washers', name: 'Get All Washers' },
			{ method: 'GET', path: '/admin/v1/washers/:washerId', name: 'Get Washer by ID' },
			{ method: 'GET', path: '/admin/v1/washers/user/:userId', name: 'Get Washers by User ID' },
			{ method: 'POST', path: '/admin/v1/washers', name: 'Create Washer', body: { userId: 'user-id', name: 'John Washer', status: 'active' } },
			{ method: 'PUT', path: '/admin/v1/washers/:washerId', name: 'Update Washer', body: { name: 'John Washer Updated', status: 'inactive' } },
			{ method: 'DELETE', path: '/admin/v1/washers/:washerId', name: 'Delete Washer' }
		],
		washerHours: [
			{ method: 'GET', path: '/admin/v1/washer-hours', name: 'Get All Washer Hours' },
			{ method: 'GET', path: '/admin/v1/washer-hours/:washerHourId', name: 'Get Washer Hour by ID' },
			{ method: 'GET', path: '/admin/v1/washer-hours/user/:userId', name: 'Get Washer Hours by User ID' },
			{ method: 'GET', path: '/admin/v1/washer-hours/user/:userId/day/:dayOfWeek', name: 'Get Washer Hours by User and Day' },
			{ method: 'POST', path: '/admin/v1/washer-hours', name: 'Create Washer Hour', body: { userId: 'user-id', dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00' } },
			{ method: 'PUT', path: '/admin/v1/washer-hours/:washerHourId', name: 'Update Washer Hour', body: { startTime: '08:00', endTime: '18:00' } },
			{ method: 'DELETE', path: '/admin/v1/washer-hours/:washerHourId', name: 'Delete Washer Hour' }
		],
		washerSlots: [
			{ method: 'GET', path: '/admin/v1/washer-slots', name: 'Get All Washer Slots' },
			{ method: 'GET', path: '/admin/v1/washer-slots/:washerSlotId', name: 'Get Washer Slot by ID' },
			{ method: 'GET', path: '/admin/v1/washer-slots/user/:userId', name: 'Get Washer Slots by User ID' },
			{ method: 'POST', path: '/admin/v1/washer-slots', name: 'Create Washer Slot', body: { userId: 'user-id', startTime: '10:00', endTime: '11:00', date: '2024-01-01' } },
			{ method: 'PUT', path: '/admin/v1/washer-slots/:washerSlotId', name: 'Update Washer Slot', body: { startTime: '11:00', endTime: '12:00' } },
			{ method: 'DELETE', path: '/admin/v1/washer-slots/:washerSlotId', name: 'Delete Washer Slot' }
		],
		washerSlotExceptions: [
			{ method: 'GET', path: '/admin/v1/washer-slot-exceptions', name: 'Get All Washer Slot Exceptions' },
			{ method: 'GET', path: '/admin/v1/washer-slot-exceptions/:washerSlotExceptionId', name: 'Get Washer Slot Exception by ID' },
			{ method: 'GET', path: '/admin/v1/washer-slot-exceptions/user/:userId', name: 'Get Washer Slot Exceptions by User ID' },
			{ method: 'POST', path: '/admin/v1/washer-slot-exceptions', name: 'Create Washer Slot Exception', body: { userId: 'user-id', date: '2024-01-01', reason: 'Holiday' } },
			{ method: 'PUT', path: '/admin/v1/washer-slot-exceptions/:washerSlotExceptionId', name: 'Update Washer Slot Exception', body: { reason: 'Sick day' } },
			{ method: 'DELETE', path: '/admin/v1/washer-slot-exceptions/:washerSlotExceptionId', name: 'Delete Washer Slot Exception' }
		],
		washerProducts: [
			{ method: 'GET', path: '/admin/v1/washer-products', name: 'Get All Washer Products' },
			{ method: 'GET', path: '/admin/v1/washer-products/:washerProductId', name: 'Get Washer Product by ID' },
			{ method: 'GET', path: '/admin/v1/washer-products/user/:userId', name: 'Get Washer Products by User ID' },
			{ method: 'GET', path: '/admin/v1/washer-products/product/:productId', name: 'Get Washer Products by Product ID' },
			{ method: 'GET', path: '/admin/v1/washer-products/user/:userId/product/:productId', name: 'Get Washer Product by User and Product ID' },
			{ method: 'POST', path: '/admin/v1/washer-products', name: 'Create Washer Product', body: { userId: 'user-id', productId: 'product-id', isAvailable: true } },
			{ method: 'PUT', path: '/admin/v1/washer-products/:washerProductId', name: 'Update Washer Product', body: { isAvailable: false } },
			{ method: 'DELETE', path: '/admin/v1/washer-products/:washerProductId', name: 'Delete Washer Product' }
		],
		chats: [
			{ method: 'GET', path: '/admin/v1/chats', name: 'Get All Chats' },
			{ method: 'GET', path: '/admin/v1/chats/:chatId', name: 'Get Chat by ID' },
			{ method: 'GET', path: '/admin/v1/chats/object/:object/:objectId', name: 'Get Chat by Object' },
			{ method: 'POST', path: '/admin/v1/chats', name: 'Create Chat', body: { object: 'booking', objectId: 'booking-id' } },
			{ method: 'PUT', path: '/admin/v1/chats/:chatId', name: 'Update Chat', body: { status: 'active' } },
			{ method: 'DELETE', path: '/admin/v1/chats/:chatId', name: 'Delete Chat' }
		],
		chatMessages: [
			{ method: 'GET', path: '/admin/v1/chats/:chatId/messages', name: 'Get Chat Messages by Chat ID' },
			{ method: 'GET', path: '/admin/v1/chats/:chatId/messages/:chatMessageId', name: 'Get Chat Message by ID' },
			{ method: 'POST', path: '/admin/v1/chats/:chatId/messages', name: 'Create Chat Message', body: { userId: 'user-id', content: 'Hello, how can I help you?' } },
			{ method: 'PUT', path: '/admin/v1/chats/:chatId/messages/:chatMessageId', name: 'Update Chat Message', body: { content: 'Updated message content' } },
			{ method: 'DELETE', path: '/admin/v1/chats/:chatId/messages/:chatMessageId', name: 'Delete Chat Message' }
		],
		chatUsers: [
			{ method: 'GET', path: '/admin/v1/chats/:chatId/users', name: 'Get Chat Users by Chat ID' },
			{ method: 'GET', path: '/admin/v1/chats/:chatId/users/:chatUserId', name: 'Get Chat User by ID' },
			{ method: 'GET', path: '/admin/v1/chats/:chatId/users/user/:userId', name: 'Get Chat User by Chat and User ID' },
			{ method: 'POST', path: '/admin/v1/chats/:chatId/users', name: 'Create Chat User', body: { userId: 'user-id', role: 'participant' } },
			{ method: 'PUT', path: '/admin/v1/chats/:chatId/users/:chatUserId', name: 'Update Chat User', body: { role: 'admin' } },
			{ method: 'DELETE', path: '/admin/v1/chats/:chatId/users/:chatUserId', name: 'Delete Chat User' }
		],
		coupons: [
			{ method: 'GET', path: '/admin/v1/coupons', name: 'Get All Coupons' },
			{ method: 'GET', path: '/admin/v1/coupons/:couponId', name: 'Get Coupon by ID' },
			{ method: 'GET', path: '/admin/v1/coupons/code/:code', name: 'Get Coupon by Code' },
			{ method: 'GET', path: '/admin/v1/coupons/user/:userId', name: 'Get Coupons by User ID' },
			{ method: 'POST', path: '/admin/v1/coupons', name: 'Create Coupon', body: { code: 'SAVE10', discount: 10, type: 'percentage' } },
			{ method: 'POST', path: '/admin/v1/coupons/:couponId/use', name: 'Use Coupon', body: { userId: 'user-id' } },
			{ method: 'PUT', path: '/admin/v1/coupons/:couponId', name: 'Update Coupon', body: { discount: 15 } },
			{ method: 'DELETE', path: '/admin/v1/coupons/:couponId', name: 'Delete Coupon' }
		],
		geofencing: [
			{ method: 'GET', path: '/admin/v1/geofencing/zip/:zip', name: 'Check ZIP Geofencing' }
		],
		geofencingChecks: [
			{ method: 'GET', path: '/admin/v1/geofencing/checks', name: 'Get All Geofencing Checks' },
			{ method: 'GET', path: '/admin/v1/geofencing/checks/:geofencingCheckId', name: 'Get Geofencing Check by ID' },
			{ method: 'GET', path: '/admin/v1/geofencing/checks/zip/:zip', name: 'Get Geofencing Check by ZIP' },
			{ method: 'POST', path: '/admin/v1/geofencing/checks', name: 'Create Geofencing Check', body: { zipCode: '10001', isAvailable: true } },
			{ method: 'PUT', path: '/admin/v1/geofencing/checks/:geofencingCheckId', name: 'Update Geofencing Check', body: { isAvailable: false } },
			{ method: 'DELETE', path: '/admin/v1/geofencing/checks/:geofencingCheckId', name: 'Delete Geofencing Check' }
		],
		geofencingCities: [
			{ method: 'GET', path: '/admin/v1/geofencing/cities', name: 'Get All Geofencing Cities' },
			{ method: 'GET', path: '/admin/v1/geofencing/cities/:geofencingCityId', name: 'Get Geofencing City by ID' },
			{ method: 'GET', path: '/admin/v1/geofencing/cities/identifier/:identifier', name: 'Get Geofencing City by Identifier' },
			{ method: 'POST', path: '/admin/v1/geofencing/cities', name: 'Create Geofencing City', body: { name: 'New York', identifier: 'nyc', isAvailable: true } },
			{ method: 'PUT', path: '/admin/v1/geofencing/cities/:geofencingCityId', name: 'Update Geofencing City', body: { isAvailable: false } },
			{ method: 'DELETE', path: '/admin/v1/geofencing/cities/:geofencingCityId', name: 'Delete Geofencing City' }
		],
		referrals: [
			{ method: 'GET', path: '/admin/v1/referrals', name: 'Get All Referrals' },
			{ method: 'GET', path: '/admin/v1/referrals/:referralId', name: 'Get Referral by ID' },
			{ method: 'GET', path: '/admin/v1/referrals/referrer/:referrerUserId', name: 'Get Referrals by Referrer User ID' },
			{ method: 'GET', path: '/admin/v1/referrals/referred/:referredUserId', name: 'Get Referrals by Referred User ID' },
			{ method: 'POST', path: '/admin/v1/referrals', name: 'Create Referral', body: { referrerUserId: 'user-1', referredUserId: 'user-2', code: 'REF123' } },
			{ method: 'PUT', path: '/admin/v1/referrals/:referralId', name: 'Update Referral', body: { status: 'completed' } },
			{ method: 'DELETE', path: '/admin/v1/referrals/:referralId', name: 'Delete Referral' }
		],
		subscriptions: [
			{ method: 'GET', path: '/admin/v1/subscriptions', name: 'Get All Subscriptions' },
			{ method: 'GET', path: '/admin/v1/subscriptions/:subscriptionId', name: 'Get Subscription by ID' },
			{ method: 'GET', path: '/admin/v1/subscriptions/user/:userId', name: 'Get Subscriptions by User ID' },
			{ method: 'GET', path: '/admin/v1/subscriptions/product/:productId', name: 'Get Subscriptions by Product ID' },
			{ method: 'POST', path: '/admin/v1/subscriptions', name: 'Create Subscription', body: { userId: 'user-id', productId: 'product-id', status: 'active' } },
			{ method: 'PUT', path: '/admin/v1/subscriptions/:subscriptionId', name: 'Update Subscription', body: { status: 'cancelled' } },
			{ method: 'DELETE', path: '/admin/v1/subscriptions/:subscriptionId', name: 'Delete Subscription' }
		],
		tickets: [
			{ method: 'GET', path: '/admin/v1/tickets', name: 'Get All Tickets' },
			{ method: 'GET', path: '/admin/v1/tickets/:ticketId', name: 'Get Ticket by ID' },
			{ method: 'GET', path: '/admin/v1/tickets/user/:userId', name: 'Get Tickets by User ID' },
			{ method: 'GET', path: '/admin/v1/tickets/assigned/:assignedTo', name: 'Get Tickets by Assigned To' },
			{ method: 'GET', path: '/admin/v1/tickets/object/:object/:objectId', name: 'Get Tickets by Object' },
			{ method: 'POST', path: '/admin/v1/tickets', name: 'Create Ticket', body: { userId: 'user-id', title: 'Support Request', description: 'Need help with booking' } },
			{ method: 'PUT', path: '/admin/v1/tickets/:ticketId', name: 'Update Ticket', body: { status: 'resolved', assignedTo: 'admin-id' } },
			{ method: 'DELETE', path: '/admin/v1/tickets/:ticketId', name: 'Delete Ticket' }
		]
	}
};

function createRequestItem(route) {
	const item = {
		name: route.name,
		request: {
			method: route.method,
			header: route.method !== 'GET' && route.method !== 'DELETE' ? [
				{
					key: 'Content-Type',
					value: 'application/json'
				}
			] : [],
			url: {
				raw: `{{baseUrl}}${route.path}`,
				host: ['{{baseUrl}}'],
				path: route.path.split('/').filter(p => p.length > 0)
			}
		}
	};

	// Add body for POST/PUT/PATCH requests
	if (route.body && ['POST', 'PUT', 'PATCH'].includes(route.method)) {
		item.request.body = {
			mode: 'raw',
			raw: JSON.stringify(route.body, null, 2)
		};
	}

	// Add path variables
	const pathVariables = route.path.match(/:[^/]+/g);
	if (pathVariables) {
		item.request.url.variable = pathVariables.map(v => ({
			key: v.substring(1),
			value: ''
		}));
	}

	// Add test script for auth routes to automatically set token
	if (route.path.includes('/auth/') && route.method === 'POST') {
		item.event = [
			{
				listen: 'test',
				script: {
					exec: [
						'if (pm.response.code === 200) {',
						'    const response = pm.response.json();',
						'    if (response.token) {',
						'        pm.collectionVariables.set(\'token\', response.token);',
						'    }',
						'}'
					]
				}
			}
		];
	}

	return item;
}

function createFolder(name, routes) {
	return {
		name: name,
		item: routes.map(createRequestItem)
	};
}

// Generate the complete collection
const collection = {
	info: {
		_postman_id: 'lavago-api-collection',
		name: 'Lavago API',
		description: 'Complete API collection for Lavago car wash service',
		schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
	},
	variable: [
		{
			key: 'baseUrl',
			value: 'http://localhost:3000',
			type: 'string'
		},
		{
			key: 'token',
			value: '',
			type: 'string'
		}
	],
	auth: {
		type: 'bearer',
		bearer: [
			{
				key: 'token',
				value: '{{token}}',
				type: 'string'
			}
		]
	},
	item: [
		createFolder('Health', routes.health),
		createFolder('Authentication', routes.auth),
		{
			name: 'Admin API',
			item: [
				createFolder('Status', routes.admin.status),
				createFolder('Users', routes.admin.users),
				createFolder('Addresses', routes.admin.addresses),
				createFolder('Vehicles', routes.admin.vehicles),
				createFolder('Wallets', routes.admin.wallets),
				createFolder('Bookings', routes.admin.bookings),
				createFolder('Booking Actions', routes.admin.bookingActions),
				createFolder('Payments', routes.admin.payments),
				createFolder('Transactions', routes.admin.transactions),
				createFolder('Products', routes.admin.products),
				createFolder('Product Prices', routes.admin.productPrices),
				createFolder('Properties', routes.admin.properties),
				createFolder('Property Hours', routes.admin.propertyHours),
				createFolder('Washers', routes.admin.washers),
				createFolder('Washer Hours', routes.admin.washerHours),
				createFolder('Washer Slots', routes.admin.washerSlots),
				createFolder('Washer Slot Exceptions', routes.admin.washerSlotExceptions),
				createFolder('Washer Products', routes.admin.washerProducts),
				createFolder('Chats', routes.admin.chats),
				createFolder('Chat Messages', routes.admin.chatMessages),
				createFolder('Chat Users', routes.admin.chatUsers),
				createFolder('Coupons', routes.admin.coupons),
				createFolder('Geofencing', routes.admin.geofencing),
				createFolder('Geofencing Checks', routes.admin.geofencingChecks),
				createFolder('Geofencing Cities', routes.admin.geofencingCities),
				createFolder('Referrals', routes.admin.referrals),
				createFolder('Subscriptions', routes.admin.subscriptions),
				createFolder('Tickets', routes.admin.tickets)
			]
		}
	]
};

// Write the collection to file
fs.writeFileSync('lavago-api.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('Postman collection generated successfully!'); 