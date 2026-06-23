import { useState, DragEvent } from 'react'

interface Props {
  file: File | null
  onFileChange: (file: File | null) => void
}

export function UploadArea({ file, onFileChange }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0] ?? null
    if (dropped && dropped.type.startsWith('image/')) {
      onFileChange(dropped)
    }
  }

  return (
    <div
      className={`upload-area ${isDragging ? 'upload-area--dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label htmlFor="file-input">
        {isDragging ? '여기에 이미지를 놓으세요' : '이미지 선택 또는 드래그'}
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      {file && <span className="file-name">{file.name}</span>}
    </div>
  )
}
