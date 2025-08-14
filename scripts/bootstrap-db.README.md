# Database Bootstrap Script

This script generates a complete SQL bootstrap file that will drop all existing tables and recreate them based on the SQL files found in the `src/features` directory.

## Usage

### Generate Bootstrap SQL

```bash
# Using npm script
npm run db:bootstrap

# Using bun directly
bun run scripts/bootstrap-db.ts
```

### What it does

1. **Scans** the `src/features` directory for all `.sql` files
2. **Generates** a complete bootstrap SQL script that:
   - Drops all existing tables in the correct order (respecting foreign key constraints)
   - Recreates all tables from the SQL files
3. **Saves** the generated SQL to `database/bootstrap.sql`
4. **Displays** the SQL content in the console for review

### Generated Files

- `database/bootstrap.sql` - Complete SQL script to bootstrap the database

### Example Output

```
🚀 Starting database bootstrap...
🔍 Scanning for SQL files in: /path/to/src/features
📁 Found 10 SQL files:
   - user/user.sql
   - address/address.sql
   - booking/booking.sql
   - vehicle/vehicle.sql
   - wallet/wallet.sql
   - ticket/ticket.sql
   - rating/ratings.sql
   - property/property.sql
   - referral/referral.sql
   - transaction/transaction.sql

📝 Generating bootstrap SQL...
✅ Bootstrap SQL generated: /path/to/database/bootstrap.sql

📋 Next steps:
1. Review the generated SQL file
2. Execute it in your database using:
   psql -h your-host -U your-user -d your-database -f database/bootstrap.sql
   or use your preferred database client

📄 Generated SQL:
================================================================================
-- Database Bootstrap Script
-- Generated on: 2024-01-15T10:30:00.000Z
-- This script will drop all existing tables and recreate them

-- Drop all existing tables (in reverse dependency order)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
...
================================================================================
```

## Executing the Bootstrap

### Using psql

```bash
psql -h your-database-host -U your-username -d your-database-name -f database/bootstrap.sql
```

### Using Supabase CLI

```bash
supabase db reset
# Then manually execute the bootstrap.sql file
```

### Using a Database Client

1. Open your preferred database client (pgAdmin, DBeaver, etc.)
2. Connect to your database
3. Open and execute the `database/bootstrap.sql` file

## Safety Notes

⚠️ **Warning**: This script will **DROP ALL EXISTING TABLES** and recreate them. Make sure to:

- Backup your database before running this script
- Only run this in development/staging environments
- Review the generated SQL before execution
- Ensure you have the correct database connection

## Customization

The script automatically:

- Finds all `.sql` files in `src/features/**/*.sql`
- Extracts table names from `CREATE TABLE IF NOT EXISTS public.table_name` statements
- Orders DROP statements to respect foreign key constraints
- Includes all SQL content from the feature files

To modify the behavior, edit the `scripts/bootstrap-db.ts` file. 