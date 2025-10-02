# SafeSync AI - Database Setup Guide

## 📋 Overview

This guide explains how to set up the Supabase database for SafeSync AI when the database connection becomes available.

## 🗄️ Database Schema

The complete schema has been designed and is ready to deploy. It includes:

### Tables (10 Total)

1. **vehicles_extended**
   - Vehicle information
   - IoT device mapping
   - Customer relationships

2. **telemetry_data**
   - High-frequency sensor data (1Hz)
   - GPS coordinates
   - Speed, acceleration, RPM
   - Time-series optimized

3. **driving_events**
   - Detected unsafe events
   - Event metadata
   - Severity classification

4. **trips_extended**
   - Trip tracking
   - Route information
   - AI-calculated safety scores

5. **ai_driver_behavior_analysis**
   - Daily/weekly/monthly analysis
   - Behavior metrics
   - AI insights and recommendations

6. **ai_accident_predictions**
   - ML-based risk predictions
   - Contributing factors
   - Explainability data (SHAP)

7. **real_time_alerts**
   - Alert history
   - Read/acknowledged status
   - AI reasoning

8. **risk_zones**
   - Accident-prone locations
   - Historical incident data
   - Active zone management

9. **ai_safety_reports**
   - Generated reports
   - Performance analysis
   - Comparative data

10. **ml_model_metadata**
    - Model versioning
    - Performance metrics
    - Feature importance

## 🚀 Setup Instructions

### Step 1: Verify Supabase Connection

The `.env` file already contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xounssoryqmdjluasitp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
```

**Check connection:**
```bash
# Test if Supabase is accessible
curl https://xounssoryqmdjluasitp.supabase.co/rest/v1/
```

### Step 2: Apply Migration

The migration SQL is embedded in the codebase but needs to be executed when the database is available.

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the migration content from the error message or codebase
4. Execute the SQL

**Option B: Using Supabase CLI** (when available)
```bash
# Initialize Supabase (if not done)
supabase init

# Create migration file
supabase migration new create_safesync_ai_schema

# Copy the migration SQL into the file

# Apply migration
supabase db push
```

### Step 3: Verify Tables

After migration, verify all tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
- ai_accident_predictions
- ai_driver_behavior_analysis
- ai_safety_reports
- driving_events
- ml_model_metadata
- real_time_alerts
- risk_zones
- telemetry_data
- trips_extended
- vehicles_extended

### Step 4: Verify Indexes

Check that performance indexes were created:

```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Step 5: Test Row Level Security

Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should have `rowsecurity = true`.

### Step 6: Verify Policies

Check RLS policies exist:

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🔐 Security Verification

### Test Customer Data Isolation

```sql
-- This should return data only for authenticated user
SELECT * FROM vehicles_extended
WHERE customer_id = auth.uid();

-- This should return empty (user can't see other users' data)
SELECT * FROM vehicles_extended
WHERE customer_id != auth.uid();
```

### Test Service Role Access

Service role (for IoT devices) should be able to insert telemetry:

```typescript
// Using service role key
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

await supabaseService.from('telemetry_data').insert({
  vehicle_id: 'vehicle-123',
  timestamp: new Date().toISOString(),
  // ... other fields
})
```

## 📊 Initial Data Seeding

### Seed Risk Zones

```sql
INSERT INTO risk_zones (
  zone_name,
  latitude,
  longitude,
  radius,
  risk_level,
  accident_count,
  incident_types,
  is_active
) VALUES
  (
    'Silk Board Junction, Bangalore',
    12.9179,
    77.6228,
    500,
    'high',
    45,
    '{"rear_end_collision", "lane_change_accident", "overspeeding"}',
    true
  ),
  (
    'ORR Flyover, Bangalore',
    12.9716,
    77.5946,
    800,
    'medium',
    28,
    '{"overspeeding", "sharp_turn", "vehicle_breakdown"}',
    true
  ),
  (
    'Electronic City Toll, Bangalore',
    12.8456,
    77.6772,
    600,
    'medium',
    32,
    '{"sudden_braking", "lane_cutting", "distracted_driving"}',
    true
  );
```

### Seed ML Model Metadata

```sql
INSERT INTO ml_model_metadata (
  model_name,
  model_type,
  version,
  accuracy,
  precision_score,
  recall,
  f1_score,
  is_active,
  model_parameters,
  feature_importance
) VALUES (
  'Accident Risk Predictor',
  'LSTM-GRU Ensemble',
  'v2.1',
  0.89,
  0.87,
  0.91,
  0.89,
  true,
  '{
    "layers": ["LSTM-128", "GRU-64", "Dense-32"],
    "optimizer": "adam",
    "learning_rate": 0.001
  }',
  '{
    "speed": 0.25,
    "acceleration": 0.20,
    "location": 0.15,
    "time": 0.10,
    "weather": 0.10,
    "driverBehavior": 0.20
  }'
);
```

## 🔌 Application Integration

### Step 1: Update Environment Variables

Ensure `.env` has both keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Test Database Connection

```typescript
import { supabase } from '@/lib/db/supabase-client'

// Test query
const { data, error } = await supabase
  .from('risk_zones')
  .select('*')
  .limit(1)

if (error) {
  console.error('Database connection failed:', error)
} else {
  console.log('Database connected successfully:', data)
}
```

### Step 3: Enable Real Data in Components

Replace simulator with real data:

```typescript
// Before (simulator)
const simulator = new TelemetrySimulator()
simulator.startSimulation(config, handleData)

// After (real data)
import { dbService } from '@/lib/db/supabase-client'

// Subscribe to real-time telemetry
const subscription = dbService.subscribeToTelemetry(
  vehicleId,
  (payload) => {
    const telemetry = payload.new
    handleData(telemetry)
  }
)
```

## 📈 Performance Optimization

### Create Additional Indexes (if needed)

```sql
-- For time-range queries
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time_range
ON telemetry_data(vehicle_id, timestamp DESC)
WHERE timestamp > NOW() - INTERVAL '7 days';

-- For alert queries
CREATE INDEX IF NOT EXISTS idx_alerts_customer_unread
ON real_time_alerts(customer_id, is_read, timestamp DESC)
WHERE is_read = false;

-- For trip analysis
CREATE INDEX IF NOT EXISTS idx_trips_customer_date_range
ON trips_extended(customer_id, start_time DESC)
WHERE start_time > NOW() - INTERVAL '30 days';
```

### Configure Automatic Cleanup

```sql
-- Create function to clean old telemetry data (keep 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_telemetry()
RETURNS void AS $$
BEGIN
  DELETE FROM telemetry_data
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule daily cleanup (using pg_cron if available)
SELECT cron.schedule(
  'cleanup-old-telemetry',
  '0 2 * * *',  -- 2 AM daily
  'SELECT cleanup_old_telemetry();'
);
```

## 🧪 Testing

### Test Data Insertion

```typescript
import { dbService } from '@/lib/db/supabase-client'

// Test telemetry insertion
const testTelemetry = {
  vehicle_id: 'test-vehicle-1',
  timestamp: new Date().toISOString(),
  latitude: 12.9716,
  longitude: 77.5946,
  speed: 60,
  acceleration_x: 0.5,
  acceleration_y: -0.2,
  acceleration_z: 9.8,
  rpm: 2500,
}

const result = await dbService.insertTelemetry(testTelemetry)
console.log('Inserted:', result)
```

### Test Real-Time Subscriptions

```typescript
// Subscribe to alerts
const unsubscribe = dbService.subscribeToAlerts(
  customerId,
  (payload) => {
    console.log('New alert:', payload.new)
  }
)

// Later: unsubscribe
unsubscribe()
```

## 🚨 Monitoring

### Key Metrics to Monitor

1. **Table Sizes**
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

2. **Row Counts**
```sql
SELECT
  schemaname,
  tablename,
  n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

3. **Index Usage**
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## 🔄 Backup & Recovery

### Enable Point-in-Time Recovery

Supabase automatically provides:
- Automated daily backups
- Point-in-time recovery (PITR)
- Replication for high availability

### Manual Backup

```bash
# Using pg_dump (if you have direct access)
pg_dump -h your-host -U postgres -d postgres -t telemetry_data > telemetry_backup.sql
```

## 📝 Migration Checklist

- [ ] Verify Supabase connection
- [ ] Apply database schema migration
- [ ] Verify all tables created
- [ ] Verify all indexes created
- [ ] Test RLS policies
- [ ] Seed initial data (risk zones, models)
- [ ] Test database connection from app
- [ ] Test telemetry insertion
- [ ] Test real-time subscriptions
- [ ] Enable performance monitoring
- [ ] Set up automated cleanup
- [ ] Configure backups
- [ ] Update documentation
- [ ] Train team on database access

## 🆘 Troubleshooting

### Connection Errors

**Error:** "Failed to connect to database"
**Solution:**
1. Check `.env` file has correct URL and keys
2. Verify Supabase project is active
3. Check network connectivity
4. Verify API keys are valid

### Permission Errors

**Error:** "new row violates row-level security policy"
**Solution:**
1. Verify RLS policies are correct
2. Check user is authenticated
3. Verify customer_id matches auth.uid()

### Performance Issues

**Error:** Slow queries
**Solution:**
1. Check indexes are being used (EXPLAIN ANALYZE)
2. Add missing indexes
3. Optimize query patterns
4. Consider partitioning large tables

### Storage Limits

**Error:** "Out of storage"
**Solution:**
1. Enable automatic cleanup of old data
2. Archive historical data to cold storage
3. Upgrade Supabase plan
4. Optimize data types and compression

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

**Database is production-ready!** Just waiting for connection to be established. 🎯
