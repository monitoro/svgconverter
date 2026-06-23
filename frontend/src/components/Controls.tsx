import { ConvertParams } from '../types'

interface Props {
  params: ConvertParams
  onChange: (params: ConvertParams) => void
}

export function Controls({ params, onChange }: Props) {
  const update = <K extends keyof ConvertParams>(key: K, value: ConvertParams[K]) => {
    onChange({ ...params, [key]: value })
  }

  const clamp = (value: number, min: number, max: number) =>
    Number.isNaN(value) ? min : Math.min(Math.max(value, min), max)

  return (
    <div className="controls">
      <label>
        <span className="control-label">임계값</span>
        <input
          type="range"
          min={0}
          max={255}
          value={params.threshold}
          onChange={(e) => update('threshold', Number(e.target.value))}
        />
        <input
          type="number"
          min={0}
          max={255}
          value={params.threshold}
          onChange={(e) => update('threshold', clamp(Number(e.target.value), 0, 255))}
        />
      </label>
      <label>
        <span className="control-label">부드러움</span>
        <input
          type="range"
          min={0}
          max={1.5}
          step={0.05}
          value={params.smoothing}
          onChange={(e) => update('smoothing', Number(e.target.value))}
        />
        <input
          type="number"
          min={0}
          max={1.5}
          step={0.05}
          value={params.smoothing}
          onChange={(e) => update('smoothing', clamp(Number(e.target.value), 0, 1.5))}
        />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={params.invert}
          onChange={(e) => update('invert', e.target.checked)}
        />
        반전
      </label>
    </div>
  )
}
