# Assignment Feature

## Core Concept
The assignment feature handles washer assignment to bookings, optimization algorithms, and reassignment logic.

## Key Responsibilities
1. **Washer Assignment**: Assign available washers to bookings
2. **Optimization**: Group nearby bookings and optimize routes
3. **Reassignment**: Handle changes and conflicts
4. **Performance Tracking**: Monitor assignment effectiveness

## Database Schema

### Assignment Table
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id),
    washer_id UUID NOT NULL REFERENCES washer_profiles(id),

    -- Assignment details
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id), -- system or admin
    assignment_type VARCHAR(20) NOT NULL DEFAULT 'auto', -- auto, manual, optimized

    -- Optimization data
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    distance_to_previous DECIMAL(10,2), -- km
    time_to_previous INTEGER, -- minutes

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    reassigned_at TIMESTAMPTZ,
    reassignment_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
```

### Assignment Groups (for optimization)
```sql
CREATE TABLE assignment_groups (
    id UUID PRIMARY KEY,
    washer_id UUID NOT NULL REFERENCES washer_profiles(id),
    date DATE NOT NULL,

    -- Group metrics
    total_bookings INTEGER NOT NULL DEFAULT 0,
    total_distance DECIMAL(10,2) DEFAULT 0.0,
    total_time INTEGER DEFAULT 0, -- minutes
    optimization_score DECIMAL(5,2) DEFAULT 0.0,

    -- Optimization details
    route_order JSONB DEFAULT '[]',
    created_by_optimization BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
```

## Business Logic

### Immediate Assignment
```typescript
// Assign washer to booking immediately
function assignWasherToBooking(booking_id: string): Assignment {
  const booking = getBooking(booking_id);
  const availableWashers = getAvailableWashers(booking.date, booking.time);

  // Find best available washer
  const bestWasher = findBestWasher(availableWashers, booking.location);

  // Create assignment
  return createAssignment(booking_id, bestWasher.id, 'auto');
}
```

### Optimization Algorithm
```typescript
// Daily optimization (18h BRT)
function optimizeAssignments(date: Date) {
  const unassignedBookings = getUnassignedBookings(date);
  const availableWashers = getAvailableWashers(date);

  // Group bookings by proximity
  const bookingGroups = groupBookingsByProximity(unassignedBookings);

  // Assign groups to washers
  for (const group of bookingGroups) {
    const bestWasher = findBestWasherForGroup(group, availableWashers);
    assignGroupToWasher(group, bestWasher);
  }
}
```

### Reassignment Logic
```typescript
// Handle reassignment when needed
function reassignBooking(booking_id: string, reason: string): Assignment {
  const currentAssignment = getCurrentAssignment(booking_id);

  // Find alternative washer
  const alternativeWasher = findAlternativeWasher(booking_id);

  // Create new assignment
  const newAssignment = createAssignment(booking_id, alternativeWasher.id, 'reassigned');

  // Deactivate old assignment
  deactivateAssignment(currentAssignment.id, reason);

  return newAssignment;
}
```

## API Endpoints

### Assignment Management
```typescript
// Assign washer to booking
POST /assignment/assign
Body: {
  booking_id: string,
  washer_id?: string, // Optional, auto-assign if not provided
  assignment_type?: 'auto' | 'manual'
}

// Get assignment for booking
GET /assignment/booking/:booking_id

// Reassign booking
POST /assignment/reassign
Body: {
  booking_id: string,
  reason: string
}
```

### Optimization
```typescript
// Trigger optimization for date
POST /assignment/optimize
Body: {
  date: string,
  washer_id?: string // Optional, optimize all if not provided
}

// Get optimization results
GET /assignment/optimization-results
Query: {
  date?: string,
  washer_id?: string
}
```

### Analytics
```typescript
// Get assignment metrics
GET /assignment/metrics
Query: {
  start_date: string,
  end_date: string,
  washer_id?: string
}
Returns: {
  total_assignments: number,
  optimization_rate: number,
  average_distance: number,
  reassignment_rate: number
}
```

## Implementation Steps

### Phase 1: Core Assignment
1. **Database Setup**
   - [ ] Create assignments table
   - [ ] Create assignment_groups table
   - [ ] Add indexes for performance

2. **Basic Assignment**
   - [ ] Immediate assignment logic
   - [ ] Basic washer selection
   - [ ] Assignment tracking

3. **API Implementation**
   - [ ] Assignment endpoints
   - [ ] Basic validation
   - [ ] Error handling

### Phase 2: Optimization System
1. **Proximity Grouping**
   - [ ] Distance calculation
   - [ ] Booking grouping algorithm
   - [ ] Route optimization

2. **Daily Optimization**
   - [ ] Automated script
   - [ ] Optimization logging
   - [ ] Performance tracking

3. **Reassignment**
   - [ ] Conflict detection
   - [ ] Alternative washer finding
   - [ ] Reassignment tracking

### Phase 3: Advanced Features
1. **Real-time Optimization**
   - [ ] Dynamic reassignment
   - [ ] Real-time conflict resolution
   - [ ] Performance monitoring

2. **Analytics**
   - [ ] Assignment effectiveness
   - [ ] Optimization metrics
   - [ ] Performance reporting

## Integration Points

### Schedule Feature
- [ ] Get available slots
- [ ] Check slot availability
- [ ] Slot booking status

### Washer Feature
- [ ] Get washer availability
- [ ] Check washer certifications
- [ ] Get washer location

### Booking Feature
- [ ] Create assignment on booking
- [ ] Update assignment status
- [ ] Handle booking changes

## Testing
- [ ] Assignment logic accuracy
- [ ] Optimization algorithm
- [ ] Reassignment handling
- [ ] Performance under load
- [ ] Integration with other features

## Documentation
- [ ] Assignment algorithm details
- [ ] Optimization process
- [ ] API documentation
- [ ] Integration guide
