'use client';

interface Props {
  showSafeZones: boolean;
  showGrid: boolean;
  zoom: number;
  onShowSafeZonesChange: (value: boolean) => void;
  onShowGridChange: (value: boolean) => void;
  onZoomChange: (value: number) => void;
}

export default function CanvasToolbar({
  showSafeZones,
  showGrid,
  zoom,
  onShowSafeZonesChange,
  onShowGridChange,
  onZoomChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSafeZones}
            onChange={(e) => onShowSafeZonesChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Show Safe Zones</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => onShowGridChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Show Grid</span>
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Zoom:</span>
        <input
          type="range"
          min="50"
          max="150"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-sm font-medium text-gray-600 w-12">{zoom}%</span>
      </div>
    </div>
  );
}
