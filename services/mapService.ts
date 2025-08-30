import type { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'

export interface MapboxFeature {
  id: string
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  properties: {
    title: string
    description?: string
    category?: string
    institutionId?: string
    activityId?: string
    beneficiariesCount?: number
    budget?: number
  }
}

export interface MapViewState {
  longitude: number
  latitude: number
  zoom: number
  bearing?: number
  pitch?: number
}

export class MapService {
  private static readonly MAPBOX_API_BASE = 'https://api.mapbox.com'
  private static readonly DEFAULT_VIEW: MapViewState = {
    longitude: -46.6333, // São Paulo, Brazil
    latitude: -23.5505,
    zoom: 10
  }

  // Geocoding services
  static async geocodeAddress(address: string): Promise<{
    coordinates: [number, number]
    placeName: string
  }> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!token) throw new Error('MapBox access token not configured')

    const response = await fetch(
      `${this.MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&country=BR&limit=1`
    )

    if (!response.ok) {
      throw new Error('Geocoding failed')
    }

    const data = await response.json()
    
    if (!data.features || data.features.length === 0) {
      throw new Error('Address not found')
    }

    const feature = data.features[0]
    return {
      coordinates: feature.center,
      placeName: feature.place_name
    }
  }

  static async reverseGeocode(longitude: number, latitude: number): Promise<string> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!token) throw new Error('MapBox access token not configured')

    const response = await fetch(
      `${this.MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=address`
    )

    if (!response.ok) {
      throw new Error('Reverse geocoding failed')
    }

    const data = await response.json()
    
    if (!data.features || data.features.length === 0) {
      return 'Unknown location'
    }

    return data.features[0].place_name
  }

  // Data transformation for map visualization
  static transformActivitiesToFeatures(activities: any[]): MapboxFeature[] {
    return activities
      .filter(activity => activity.latitude && activity.longitude)
      .map(activity => ({
        id: activity.id,
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [activity.longitude, activity.latitude]
        },
        properties: {
          title: activity.title || activity.name,
          description: activity.description,
          category: activity.category,
          institutionId: activity.institution_id,
          activityId: activity.id,
          beneficiariesCount: activity.beneficiaries_count,
          budget: activity.budget
        }
      }))
  }

  static transformInstitutionsToFeatures(institutions: any[]): MapboxFeature[] {
    return institutions
      .filter(institution => institution.latitude && institution.longitude)
      .map(institution => ({
        id: institution.id,
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [institution.longitude, institution.latitude]
        },
        properties: {
          title: institution.name,
          description: institution.description,
          category: 'institution',
          institutionId: institution.id
        }
      }))
  }

  // Map utilities
  static getDefaultViewState(): MapViewState {
    return { ...this.DEFAULT_VIEW }
  }

  static calculateBounds(features: MapboxFeature[]): LngLatBoundsLike | null {
    if (features.length === 0) return null

    const coordinates = features.map(f => f.geometry.coordinates)
    
    const lngs = coordinates.map(coord => coord[0])
    const lats = coordinates.map(coord => coord[1])
    
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    
    return [
      [minLng, minLat],
      [maxLng, maxLat]
    ]
  }

  static fitBoundsOptions = {
    padding: 50,
    maxZoom: 15,
    duration: 1000
  }

  // Clustering utilities
  static clusterFeatures(features: MapboxFeature[], zoom: number): MapboxFeature[] {
    // Simple clustering logic - can be enhanced with libraries like supercluster
    if (zoom > 12) return features // No clustering at high zoom levels
    
    // Basic grid-based clustering
    const gridSize = 0.01 // Adjust based on zoom level
    const clusters: { [key: string]: MapboxFeature[] } = {}
    
    features.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates
      const gridLng = Math.floor(lng / gridSize) * gridSize
      const gridLat = Math.floor(lat / gridSize) * gridSize
      const key = `${gridLng},${gridLat}`
      
      if (!clusters[key]) clusters[key] = []
      clusters[key].push(feature)
    })
    
    return Object.entries(clusters).map(([key, clusterFeatures]) => {
      if (clusterFeatures.length === 1) return clusterFeatures[0]
      
      const [gridLng, gridLat] = key.split(',').map(Number)
      const totalBeneficiaries = clusterFeatures.reduce(
        (sum, f) => sum + (f.properties.beneficiariesCount || 0), 0
      )
      const totalBudget = clusterFeatures.reduce(
        (sum, f) => sum + (f.properties.budget || 0), 0
      )
      
      return {
        id: `cluster-${key}`,
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [gridLng, gridLat]
        },
        properties: {
          title: `${clusterFeatures.length} atividades`,
          description: `${totalBeneficiaries} beneficiários`,
          category: 'cluster',
          beneficiariesCount: totalBeneficiaries,
          budget: totalBudget
        }
      }
    })
  }
}
