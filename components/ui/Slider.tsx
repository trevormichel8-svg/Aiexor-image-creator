interface SliderProps {
  value: number
  onChange: (v: number) => void
}

export function Slider({ value, onChange }: SliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
