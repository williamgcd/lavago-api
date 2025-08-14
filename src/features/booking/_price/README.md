# Property Pricing System

## Overview
The property pricing system uses multipliers to adjust base product prices while maintaining consistent baseline pricing across the platform.

## Multiplier System

### Components
1. **Base Price**
   - Set at the product level
   - Consistent across all locations
   - Varies by vehicle size

2. **Property Multiplier** (`price_multiple`)
   - Range: 0.0 to 100.0
   - Default: 1.0
   - Affects final price calculation
   - Controlled by property terms

3. **Cashback Rate** (`price_cashback`)
   - Range: 0% to 100%
   - Default: 0%
   - Applied after final price calculation

### Price Calculation
```typescript
final_price = base_price * vehicle_size_factor * property_multiplier
cashback_amount = final_price * (price_cashback / 100)
```

## Property Types

### Standard Properties
- Multiplier: 1.0
- Standard pricing applies
- No special terms required

### Premium Properties
- Multiplier: > 1.0
- Higher pricing tier
- Requires active terms
- May have special service requirements

### Partner Properties
- Multiplier: < 1.0
- Discounted pricing
- Requires partnership agreement
- May have volume commitments

## Terms Integration

### Requirements
1. **Active Terms**
   - Required for non-standard multipliers
   - Must be current and accepted
   - Regular renewal needed

2. **Pricing Terms**
   - Multiplier specification
   - Duration of agreement
   - Volume commitments (if any)
   - Special conditions

3. **Service Terms**
   - Access requirements
   - Operating hours
   - Service standards
   - Support commitments

### Expiration Handling
- Revert to standard pricing (1.0)
- Grace period for renewal
- Notification system
- Booking impact

## Implementation Details

### Database Fields
```sql
ALTER TABLE properties
ADD COLUMN price_multiple NUMERIC(5,2) DEFAULT 1.0,
ADD COLUMN price_cashback NUMERIC(5,2) DEFAULT 0.0,
ADD CONSTRAINT price_multiple_range
    CHECK (price_multiple >= 0 AND price_multiple <= 100),
ADD CONSTRAINT price_cashback_range
    CHECK (price_cashback >= 0 AND price_cashback <= 100);
```

### API Endpoints

#### Get Property Pricing
```typescript
GET /api/v1/properties/:id/pricing
Returns: {
  base_multiplier: number,
  cashback_rate: number,
  terms_status: {
    active: boolean,
    expires_at: Date | null
  }
}
```

#### Update Property Pricing
```typescript
PUT /api/v1/properties/:id/pricing
Body: {
  price_multiple: number,
  price_cashback: number,
  terms_id: string
}
```

## Business Rules

### Multiplier Changes
1. **Validation**
   - Must have active terms
   - Within allowed range
   - Authorized approver

2. **Timing**
   - Notice period required
   - Effective date rules
   - Booking impact handling

3. **Special Cases**
   - Promotional periods
   - Volume discounts
   - Seasonal adjustments

### Booking Impact
1. **Active Bookings**
   - Honor existing prices
   - Update future bookings
   - Notification requirements

2. **Future Bookings**
   - Apply new multiplier
   - Handle transitions
   - User communications

## Monitoring & Analytics

### Metrics
- Multiplier distribution
- Revenue impact
- Booking patterns
- User response

### Reporting
- Property performance
- Price comparison
- Market analysis
- Term compliance
