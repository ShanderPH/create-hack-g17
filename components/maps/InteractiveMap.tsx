"use client"

import { useState, useCallback, useMemo } from 'react'
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl'
import { MapService, type MapboxFeature, type MapViewState } from '@/services/mapService'
import { useUIStore } from '@/stores/uiStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import 'mapbox-gl/dist/mapbox-gl.css'

interface InteractiveMapProps {
  features: MapboxFeature[]
  onFeatureClick?: (feature: MapboxFeature) => void
  height?: string
  showControls?: boolean
}

export function InteractiveMap({ 
  features, 
  onFeatureClick, 
  height = '400px',
  showControls = true 
}: InteractiveMapProps) {
  const { mapViewState, updateMapViewState } = useUIStore()
  const [selectedFeature, setSelectedFeature] = useState<MapboxFeature | null>(null)

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const onViewStateChange = useCallback((evt: { viewState: MapViewState }) => {
    updateMapViewState(evt.viewState)
  }, [updateMapViewState])

  const onMarkerClick = useCallback((feature: MapboxFeature) => {
    setSelectedFeature(feature)
    onFeatureClick?.(feature)
  }, [onFeatureClick])

  const onPopupClose = useCallback(() => {
    setSelectedFeature(null)
  }, [])

  const fitToBounds = useCallback(() => {
    const bounds = MapService.calculateBounds(features)
    if (bounds && Array.isArray(bounds) && bounds.length === 2) {
      // This would typically use map.fitBounds() but we'll simulate it
      const [sw, ne] = bounds as [[number, number], [number, number]]
      const centerLng = (sw[0] + ne[0]) / 2
      const centerLat = (sw[1] + ne[1]) / 2
      
      updateMapViewState({
        longitude: centerLng,
        latitude: centerLat,
        zoom: 10
      })
    }
  }, [features, updateMapViewState])

  const clusteredFeatures = useMemo(() => {
    return MapService.clusterFeatures(features, mapViewState.zoom)
  }, [features, mapViewState.zoom])

  if (!mapboxToken) {
    return (
      <Card className="w-full" style={{ height }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <CardTitle>Mapa não disponível</CardTitle>
            <CardDescription>
              Token do MapBox não configurado. Adicione NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ao arquivo .env.local
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <Map
        {...mapViewState}
        onMove={onViewStateChange}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
      >
        {/* Markers */}
        {clusteredFeatures.map((feature) => (
          <Marker
            key={feature.id}
            longitude={feature.geometry.coordinates[0]}
            latitude={feature.geometry.coordinates[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              onMarkerClick(feature)
            }}
          >
            <div className="cursor-pointer">
              {feature.properties.category === 'cluster' ? (
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shadow-lg">
                  {feature.properties.title?.split(' ')[0]}
                </div>
              ) : (
                <div className={`w-4 h-4 rounded-full shadow-lg ${
                  feature.properties.category === 'institution' 
                    ? 'bg-green-500' 
                    : 'bg-blue-500'
                }`} />
              )}
            </div>
          </Marker>
        ))}

        {/* Popup */}
        {selectedFeature && (
          <Popup
            longitude={selectedFeature.geometry.coordinates[0]}
            latitude={selectedFeature.geometry.coordinates[1]}
            anchor="top"
            onClose={onPopupClose}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1">
                {selectedFeature.properties.title}
              </h3>
              {selectedFeature.properties.description && (
                <p className="text-xs text-default-500 mb-2">
                  {selectedFeature.properties.description}
                </p>
              )}
              <div className="space-y-1 text-xs">
                {selectedFeature.properties.beneficiariesCount && (
                  <div className="flex justify-between">
                    <span>Beneficiários:</span>
                    <span className="font-medium">
                      {selectedFeature.properties.beneficiariesCount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                )}
                {selectedFeature.properties.budget && (
                  <div className="flex justify-between">
                    <span>Orçamento:</span>
                    <span className="font-medium">
                      R$ {selectedFeature.properties.budget.toLocaleString('pt-BR')}
                    </span>
                  </div>
                )}
                {selectedFeature.properties.category && (
                  <div className="flex justify-between">
                    <span>Categoria:</span>
                    <span className="font-medium capitalize">
                      {selectedFeature.properties.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}

        {/* Controls */}
        {showControls && (
          <>
            <NavigationControl position="top-right" />
            <FullscreenControl position="top-right" />
            <ScaleControl position="bottom-left" />
          </>
        )}
      </Map>

      {/* Custom Controls */}
      {features.length > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={fitToBounds}
            className="bg-content1 shadow-md"
          >
            Ajustar visualização
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Instituições</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Atividades</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                N
              </div>
              <span>Agrupamento</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
