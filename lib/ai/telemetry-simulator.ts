import type { TelemetryData } from './driver-behavior-analyzer'

export interface SimulationConfig {
  vehicleId: string
  intervalMs: number
  scenario: 'normal' | 'aggressive' | 'highway' | 'city' | 'dangerous' | 'fatigue'
  startLocation: { lat: number; lng: number }
}

export class TelemetrySimulator {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null
  private currentLocation = { lat: 12.9716, lng: 77.5946 }
  private currentSpeed = 0
  private currentHeading = 0
  private telemetryHistory: TelemetryData[] = []

  startSimulation(
    config: SimulationConfig,
    onData: (data: TelemetryData) => void
  ): void {
    if (this.isRunning) {
      console.warn('Simulation already running')
      return
    }

    this.isRunning = true
    this.currentLocation = config.startLocation
    this.currentSpeed = 0
    this.telemetryHistory = []

    this.intervalId = setInterval(() => {
      const telemetry = this.generateTelemetry(config.scenario)
      this.telemetryHistory.push(telemetry)

      if (this.telemetryHistory.length > 1000) {
        this.telemetryHistory = this.telemetryHistory.slice(-1000)
      }

      onData(telemetry)
    }, config.intervalMs)
  }

  stopSimulation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
  }

  getTelemetryHistory(): TelemetryData[] {
    return [...this.telemetryHistory]
  }

  private generateTelemetry(scenario: SimulationConfig['scenario']): TelemetryData {
    const baseData = this.generateBaseScenario(scenario)

    this.updateLocation(baseData.speed)

    const telemetry: TelemetryData = {
      timestamp: new Date(),
      speed: baseData.speed,
      accelerationX: baseData.accelerationX,
      accelerationY: baseData.accelerationY,
      accelerationZ: baseData.accelerationZ + 9.81,
      latitude: this.currentLocation.lat,
      longitude: this.currentLocation.lng,
      rpm: this.calculateRPM(baseData.speed),
      throttlePosition: baseData.throttlePosition,
      brakePressure: baseData.brakePressure,
      steeringAngle: baseData.steeringAngle,
      fuelLevel: Math.max(0, 100 - this.telemetryHistory.length * 0.01),
      engineTemp: 85 + Math.random() * 10,
    }

    this.currentSpeed = baseData.speed

    return telemetry
  }

  private generateBaseScenario(scenario: SimulationConfig['scenario']): {
    speed: number
    accelerationX: number
    accelerationY: number
    accelerationZ: number
    throttlePosition: number
    brakePressure: number
    steeringAngle: number
  } {
    switch (scenario) {
      case 'normal':
        return this.generateNormalDriving()
      case 'aggressive':
        return this.generateAggressiveDriving()
      case 'highway':
        return this.generateHighwayDriving()
      case 'city':
        return this.generateCityDriving()
      case 'dangerous':
        return this.generateDangerousDriving()
      case 'fatigue':
        return this.generateFatigueDriving()
      default:
        return this.generateNormalDriving()
    }
  }

  private generateNormalDriving() {
    const targetSpeed = 50 + Math.random() * 20
    const speedDiff = targetSpeed - this.currentSpeed
    const acceleration = speedDiff * 0.1 + (Math.random() - 0.5) * 0.5

    return {
      speed: Math.max(0, this.currentSpeed + acceleration),
      accelerationX: acceleration,
      accelerationY: (Math.random() - 0.5) * 1,
      accelerationZ: (Math.random() - 0.5) * 0.5,
      throttlePosition: Math.min(100, Math.max(0, 30 + acceleration * 10)),
      brakePressure: acceleration < -1 ? Math.abs(acceleration) * 2 : 0,
      steeringAngle: (Math.random() - 0.5) * 10,
    }
  }

  private generateAggressiveDriving() {
    const targetSpeed = 70 + Math.random() * 40
    const speedDiff = targetSpeed - this.currentSpeed
    const acceleration = speedDiff * 0.3 + (Math.random() - 0.3) * 3

    const harshBraking = Math.random() < 0.1 ? -10 + Math.random() * 2 : 0
    const rapidAccel = Math.random() < 0.15 ? 5 + Math.random() * 3 : acceleration

    return {
      speed: Math.max(0, this.currentSpeed + (harshBraking || rapidAccel)),
      accelerationX: harshBraking || rapidAccel,
      accelerationY: (Math.random() - 0.5) * 3,
      accelerationZ: (Math.random() - 0.5) * 2,
      throttlePosition: Math.min(100, Math.max(0, 60 + rapidAccel * 5)),
      brakePressure: harshBraking ? Math.abs(harshBraking) * 3 : 0,
      steeringAngle: (Math.random() - 0.5) * 35,
    }
  }

  private generateHighwayDriving() {
    const targetSpeed = 90 + Math.random() * 20
    const speedDiff = targetSpeed - this.currentSpeed
    const acceleration = speedDiff * 0.05 + (Math.random() - 0.5) * 0.3

    return {
      speed: Math.max(0, this.currentSpeed + acceleration),
      accelerationX: acceleration,
      accelerationY: (Math.random() - 0.5) * 0.5,
      accelerationZ: (Math.random() - 0.5) * 0.3,
      throttlePosition: Math.min(100, Math.max(0, 50 + acceleration * 8)),
      brakePressure: acceleration < -0.5 ? Math.abs(acceleration) * 2 : 0,
      steeringAngle: (Math.random() - 0.5) * 5,
    }
  }

  private generateCityDriving() {
    const targetSpeed = 20 + Math.random() * 30
    const speedDiff = targetSpeed - this.currentSpeed
    const acceleration = speedDiff * 0.2 + (Math.random() - 0.5) * 1.5

    const stopAndGo = Math.random() < 0.2

    return {
      speed: Math.max(0, stopAndGo ? this.currentSpeed * 0.5 : this.currentSpeed + acceleration),
      accelerationX: stopAndGo ? -4 : acceleration,
      accelerationY: (Math.random() - 0.5) * 2,
      accelerationZ: (Math.random() - 0.5) * 1,
      throttlePosition: Math.min(100, Math.max(0, 40 + acceleration * 10)),
      brakePressure: stopAndGo ? 8 : acceleration < -1 ? Math.abs(acceleration) * 2 : 0,
      steeringAngle: (Math.random() - 0.5) * 20,
    }
  }

  private generateDangerousDriving() {
    const targetSpeed = 100 + Math.random() * 40
    const speedDiff = targetSpeed - this.currentSpeed

    const extremeEvent = Math.random() < 0.15

    if (extremeEvent) {
      const eventType = Math.random()
      if (eventType < 0.33) {
        return {
          speed: Math.max(0, this.currentSpeed - 15),
          accelerationX: -12,
          accelerationY: (Math.random() - 0.5) * 5,
          accelerationZ: (Math.random() - 0.5) * 3,
          throttlePosition: 0,
          brakePressure: 15,
          steeringAngle: (Math.random() - 0.5) * 50,
        }
      } else if (eventType < 0.66) {
        return {
          speed: Math.min(140, this.currentSpeed + 8),
          accelerationX: 8,
          accelerationY: (Math.random() - 0.5) * 4,
          accelerationZ: (Math.random() - 0.5) * 2,
          throttlePosition: 100,
          brakePressure: 0,
          steeringAngle: (Math.random() - 0.5) * 45,
        }
      }
    }

    const acceleration = speedDiff * 0.4 + (Math.random() - 0.3) * 4

    return {
      speed: Math.max(0, this.currentSpeed + acceleration),
      accelerationX: acceleration,
      accelerationY: (Math.random() - 0.5) * 4,
      accelerationZ: (Math.random() - 0.5) * 3,
      throttlePosition: Math.min(100, Math.max(0, 70 + acceleration * 5)),
      brakePressure: acceleration < -2 ? Math.abs(acceleration) * 3 : 0,
      steeringAngle: (Math.random() - 0.5) * 40,
    }
  }

  private generateFatigueDriving() {
    const waveEffect = Math.sin(this.telemetryHistory.length * 0.1) * 15
    const microSleep = Math.random() < 0.05

    if (microSleep) {
      return {
        speed: Math.max(0, this.currentSpeed - 8),
        accelerationX: -3,
        accelerationY: (Math.random() - 0.5) * 6,
        accelerationZ: (Math.random() - 0.5) * 3,
        throttlePosition: 0,
        brakePressure: 0,
        steeringAngle: (Math.random() - 0.5) * 25,
      }
    }

    const targetSpeed = 60 + waveEffect
    const speedDiff = targetSpeed - this.currentSpeed
    const acceleration = speedDiff * 0.15

    return {
      speed: Math.max(0, this.currentSpeed + acceleration),
      accelerationX: acceleration,
      accelerationY: (Math.random() - 0.5) * 3,
      accelerationZ: (Math.random() - 0.5) * 1.5,
      throttlePosition: Math.min(100, Math.max(0, 35 + Math.abs(waveEffect) * 2)),
      brakePressure: acceleration < -1 ? Math.abs(acceleration) * 2 : 0,
      steeringAngle: waveEffect * 0.5 + (Math.random() - 0.5) * 15,
    }
  }

  private updateLocation(speed: number): void {
    const speedMs = speed / 3.6
    const distanceKm = (speedMs * 1) / 1000

    this.currentHeading += (Math.random() - 0.5) * 10
    this.currentHeading = (this.currentHeading + 360) % 360

    const headingRad = (this.currentHeading * Math.PI) / 180

    const deltaLat = (distanceKm * Math.cos(headingRad)) / 111.32
    const deltaLng = (distanceKm * Math.sin(headingRad)) / (111.32 * Math.cos((this.currentLocation.lat * Math.PI) / 180))

    this.currentLocation.lat += deltaLat
    this.currentLocation.lng += deltaLng
  }

  private calculateRPM(speed: number): number {
    const baseRPM = 800
    const rpmPerKmh = 35

    return Math.round(baseRPM + speed * rpmPerKmh + (Math.random() - 0.5) * 100)
  }
}
