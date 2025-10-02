import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface TelemetryDataRecord {
  id?: string
  vehicle_id: string
  timestamp: string
  latitude: number
  longitude: number
  speed: number
  acceleration_x: number
  acceleration_y: number
  acceleration_z: number
  rpm?: number
  throttle_position?: number
  brake_pressure?: number
  steering_angle?: number
  fuel_level?: number
  engine_temp?: number
}

export interface DrivingEventRecord {
  id?: string
  vehicle_id: string
  trip_id?: string
  event_type: string
  severity: string
  timestamp: string
  latitude: number
  longitude: number
  speed_at_event: number
  acceleration_magnitude?: number
  event_data?: any
}

export interface AccidentPredictionRecord {
  id?: string
  vehicle_id: string
  trip_id?: string
  prediction_timestamp: string
  risk_score: number
  risk_level: string
  prediction_model: string
  contributing_factors: any
  anomaly_detected: boolean
  anomaly_type?: string
  latitude: number
  longitude: number
  speed: number
  time_to_risk: number
  confidence_score: number
  explainability_data: any
  alert_sent: boolean
}

export interface RealTimeAlertRecord {
  id?: string
  vehicle_id: string
  customer_id: string
  trip_id?: string
  alert_type: string
  severity: string
  timestamp: string
  latitude: number
  longitude: number
  message: string
  explanation: string
  ai_reasoning: any
  recommended_action: string
  is_read: boolean
  is_acknowledged: boolean
}

export class SupabaseService {
  async insertTelemetry(data: TelemetryDataRecord) {
    const { data: result, error } = await supabase
      .from('telemetry_data')
      .insert(data)
      .select()
      .maybeSingle()

    if (error) throw error
    return result
  }

  async insertDrivingEvent(event: DrivingEventRecord) {
    const { data: result, error } = await supabase
      .from('driving_events')
      .insert(event)
      .select()
      .maybeSingle()

    if (error) throw error
    return result
  }

  async insertAccidentPrediction(prediction: AccidentPredictionRecord) {
    const { data: result, error } = await supabase
      .from('ai_accident_predictions')
      .insert(prediction)
      .select()
      .maybeSingle()

    if (error) throw error
    return result
  }

  async insertAlert(alert: RealTimeAlertRecord) {
    const { data: result, error } = await supabase
      .from('real_time_alerts')
      .insert(alert)
      .select()
      .maybeSingle()

    if (error) throw error
    return result
  }

  async getTelemetry(vehicleId: string, limit = 100) {
    const { data, error } = await supabase
      .from('telemetry_data')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  async getDrivingEvents(vehicleId: string, startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('driving_events')
      .select('*')
      .eq('vehicle_id', vehicleId)

    if (startDate) {
      query = query.gte('timestamp', startDate.toISOString())
    }

    if (endDate) {
      query = query.lte('timestamp', endDate.toISOString())
    }

    const { data, error } = await query.order('timestamp', { ascending: false })

    if (error) throw error
    return data
  }

  async getUnreadAlerts(customerId: string) {
    const { data, error } = await supabase
      .from('real_time_alerts')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_read', false)
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data
  }

  async markAlertAsRead(alertId: string) {
    const { error } = await supabase
      .from('real_time_alerts')
      .update({ is_read: true })
      .eq('id', alertId)

    if (error) throw error
  }

  async acknowledgeAlert(alertId: string) {
    const { error } = await supabase
      .from('real_time_alerts')
      .update({
        is_acknowledged: true,
        is_read: true,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', alertId)

    if (error) throw error
  }

  async getRecentPredictions(vehicleId: string, limit = 50) {
    const { data, error } = await supabase
      .from('ai_accident_predictions')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('prediction_timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  async getVehiclesByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('vehicles_extended')
      .select('*')
      .eq('customer_id', customerId)

    if (error) throw error
    return data
  }

  async createTrip(tripData: any) {
    const { data, error } = await supabase
      .from('trips_extended')
      .insert(tripData)
      .select()
      .maybeSingle()

    if (error) throw error
    return data
  }

  async updateTrip(tripId: string, updates: any) {
    const { data, error } = await supabase
      .from('trips_extended')
      .update(updates)
      .eq('id', tripId)
      .select()
      .maybeSingle()

    if (error) throw error
    return data
  }

  async getSafetyReports(customerId: string, reportType?: string) {
    let query = supabase
      .from('ai_safety_reports')
      .select('*')
      .eq('customer_id', customerId)

    if (reportType) {
      query = query.eq('report_type', reportType)
    }

    const { data, error } = await query.order('generated_at', { ascending: false })

    if (error) throw error
    return data
  }

  async insertSafetyReport(report: any) {
    const { data, error } = await supabase
      .from('ai_safety_reports')
      .insert(report)
      .select()
      .maybeSingle()

    if (error) throw error
    return data
  }

  subscribeToTelemetry(vehicleId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`telemetry:${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry_data',
          filter: `vehicle_id=eq.${vehicleId}`,
        },
        callback
      )
      .subscribe()
  }

  subscribeToAlerts(customerId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`alerts:${customerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'real_time_alerts',
          filter: `customer_id=eq.${customerId}`,
        },
        callback
      )
      .subscribe()
  }
}

export const dbService = new SupabaseService()
