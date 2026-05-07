# RE-MMOGO Database Migration Guide

This guide provides a complete roadmap for transitioning from mock data to PostgreSQL database implementation.

## Overview

The migration involves:
1. Setting up the PostgreSQL database using the provided schema
2. Creating API endpoints to replace mock data imports
3. Updating frontend components to use API calls
4. Ensuring data consistency across all features

## Database Schema

The complete PostgreSQL schema is available in `database_schema.sql`. Key features:

### Core Tables
- **groups**: Savings group information
- **members**: Member details and financial status
- **group_signatories**: Signatory relationships
- **group_treasurers**: Treasurer relationships

### Financial Tables
- **loans**: Loan applications and tracking
- **contributions**: Member contributions
- **loan_repayments**: Loan repayment tracking

### Approval System
- **loan_signatory_approvals**: Signatory approvals for loans
- **contribution_signatory_approvals**: Signatory approvals for contributions
- **repayment_signatory_approvals**: Signatory approvals for repayments

### Reporting
- **year_end_reports**: Annual group reports
- **member_year_end_reports**: Individual member reports

## Data Type Consistency

### Financial Values
All monetary values use `DECIMAL(12,2)` for precise financial calculations:
- Monthly contributions: `DECIMAL(12,2)`
- Loan amounts: `DECIMAL(12,2)`
- Balances: `DECIMAL(12,2)`
- Interest rates: `DECIMAL(5,4)` (e.g., 0.2000 for 20%)

### Dates and Timestamps
- **Dates**: Stored as `DATE` type (YYYY-MM-DD format)
- **Timestamps**: Stored as `TIMESTAMP WITH TIME ZONE` (ISO format)
- **Frontend**: Use string format for consistency

### Status Fields
Using PostgreSQL ENUM types for consistency:
- `member_role`: 'Member', 'Signatory', 'Treasurer'
- `signatory_status`: 'approved', 'pending', 'rejected'
- `loan_status`: 'pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'
- `transaction_status`: 'pending', 'approved', 'rejected'

## Migration Steps

### 1. Database Setup

```bash
# Create database
createdb remmogo

# Run schema setup
psql -d remmogo -f database_schema.sql
```

### 2. Backend API Implementation

Create API endpoints that mirror the mock data structure:

#### Groups API
```typescript
// GET /api/groups
// POST /api/groups
// GET /api/groups/:id
// PUT /api/groups/:id
// DELETE /api/groups/:id
```

#### Members API
```typescript
// GET /api/members
// POST /api/members
// GET /api/members/:id
// PUT /api/members/:id
// DELETE /api/members/:id
// GET /api/groups/:groupId/members
```

#### Loans API
```typescript
// GET /api/loans
// POST /api/loans
// GET /api/loans/:id
// PUT /api/loans/:id
// GET /api/members/:memberId/loans
// GET /api/groups/:groupId/loans
```

#### Contributions API
```typescript
// GET /api/contributions
// POST /api/contributions
// GET /api/contributions/:id
// PUT /api/contributions/:id
// GET /api/members/:memberId/contributions
// GET /api/groups/:groupId/contributions
```

### 3. Frontend Data Layer Updates

Replace mock data imports with API calls:

#### Update dataConfig.ts
```typescript
// Before
import { MEMBERS, LOANS, CONTRIBUTIONS } from '../data/mockData';

// After
import { apiClient } from '../utils/apiClient';

export const getMembers = async (groupId?: number) => {
  const url = groupId ? `/api/groups/${groupId}/members` : '/api/members';
  return await apiClient.get(url);
};

export const getLoans = async (groupId?: number) => {
  const url = groupId ? `/api/groups/${groupId}/loans` : '/api/loans';
  return await apiClient.get(url);
};
```

#### Update useCurrentGroup Hook
```typescript
// Before
useEffect(() => {
  const userGroups = MOCK_GROUPS;
  setState(prev => ({
    ...prev,
    currentGroup: userGroups[0] || null,
    userGroups,
    currentGroupMembers: MEMBERS,
    currentGroupLoans: LOANS,
    currentGroupContributions: CONTRIBUTIONS,
    isLoading: false,
  }));
}, []);

// After
useEffect(() => {
  const loadGroupData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const [groupsResponse, membersResponse, loansResponse, contributionsResponse] = await Promise.all([
        apiClient.get('/api/groups'),
        apiClient.get('/api/members'),
        apiClient.get('/api/loans'),
        apiClient.get('/api/contributions')
      ]);

      const userGroups = groupsResponse.data;
      const currentGroup = userGroups[0] || null;

      setState(prev => ({
        ...prev,
        currentGroup,
        userGroups,
        currentGroupMembers: membersResponse.data,
        currentGroupLoans: loansResponse.data,
        currentGroupContributions: contributionsResponse.data,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to load group data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  loadGroupData();
}, []);
```

### 4. Component Updates

Update components to use async data loading:

#### Dashboard Component
```typescript
// Before
import { SUMMARY_DATA, MEMBER_DATA } from '../config/dataConfig';

// After
import { useGroupSummary } from '../hooks/useGroupSummary';

const Dashboard = () => {
  const { summary, loading, error } = useGroupSummary();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Use summary data
};
```

#### Loan Request Component
```typescript
// Before
const onSubmit = (data) => {
  // Create loan object
  const loan = { ...data, id: Date.now() };
  // Add to local state
};

// After
const onSubmit = async (data) => {
  try {
    const response = await apiClient.post('/api/loans', {
      member_id: parseInt(data.memberId),
      amount: parseFloat(data.amount),
      purpose: data.purpose,
      repayment_months: parseInt(data.repaymentMonths),
      notes: data.notes
    });
    
    toast.success('Loan request submitted successfully');
    navigate('/dashboard');
  } catch (error) {
    toast.error('Failed to submit loan request');
  }
};
```

## Data Validation

### Backend Validation
Implement validation using the database types:

```typescript
import { CreateLoanRequest, MemberRole } from '../types/database';

export const validateLoanRequest = (data: CreateLoanRequest): string[] => {
  const errors: string[] = [];
  
  if (data.amount <= 0) {
    errors.push('Loan amount must be positive');
  }
  
  if (data.repayment_months <= 0) {
    errors.push('Repayment period must be positive');
  }
  
  if (!data.purpose.trim()) {
    errors.push('Purpose is required');
  }
  
  return errors;
};
```

### Frontend Validation
Use the same validation rules:

```typescript
import { isValidMemberRole, isValidLoanStatus } from '../types/database';

const validateMemberForm = (data: MemberFormData): string[] => {
  const errors: string[] = [];
  
  if (!isValidMemberRole(data.role)) {
    errors.push('Invalid member role');
  }
  
  // Add more validations...
  
  return errors;
};
```

## Performance Considerations

### Database Indexes
The schema includes optimized indexes for common queries:
- Member lookups by email and ID
- Group-based queries
- Status-based filtering
- Date-range queries

### API Optimization
- Implement pagination for large datasets
- Use database views for complex summaries
- Cache frequently accessed data
- Implement proper error handling

### Frontend Optimization
- Use React Query or SWR for data fetching
- Implement optimistic updates
- Add loading states and error boundaries
- Cache API responses appropriately

## Testing Strategy

### Unit Tests
```typescript
// Test API endpoints
describe('Groups API', () => {
  test('should create a new group', async () => {
    const groupData = {
      name: 'Test Group',
      monthly_contribution: 1000,
      // ... other fields
    };
    
    const response = await request(app)
      .post('/api/groups')
      .send(groupData)
      .expect(201);
      
    expect(response.body.name).toBe(groupData.name);
  });
});
```

### Integration Tests
```typescript
// Test data flow
describe('Loan Request Flow', () => {
  test('should complete loan request workflow', async () => {
    // Create member
    // Submit loan request
    // Get signatory approvals
    // Approve loan
    // Verify loan status
  });
});
```

## Security Considerations

### Database Security
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use database roles for access control
- Encrypt sensitive data

### API Security
- Implement JWT authentication
- Use HTTPS for all API calls
- Validate all input data
- Implement rate limiting
- Add CORS configuration

## Rollback Strategy

### Database Rollback
```sql
-- Create backup before migration
pg_dump remmogo > backup_before_migration.sql

-- Rollback if needed
psql -d remmogo < backup_before_migration.sql
```

### Code Rollback
- Use version control (Git) for code changes
- Implement feature flags for gradual rollout
- Monitor application performance
- Have quick rollback procedures

## Monitoring and Maintenance

### Database Monitoring
- Monitor query performance
- Set up alerts for long-running queries
- Regular database maintenance
- Backup and recovery procedures

### Application Monitoring
- API response time monitoring
- Error rate tracking
- User activity logging
- Performance metrics

## Next Steps

1. **Set up development environment** with PostgreSQL
2. **Create API endpoints** following the schema
3. **Update frontend components** gradually
4. **Implement comprehensive testing**
5. **Set up monitoring and logging**
6. **Plan production deployment**

## Support Files

- `database_schema.sql` - Complete PostgreSQL setup
- `src/types/database.ts` - TypeScript types matching the schema
- Mock data files - Reference for data structure and relationships

This migration ensures complete data consistency and type safety across the entire RE-MMOGO application.
