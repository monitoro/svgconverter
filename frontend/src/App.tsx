import { useState } from 'react'
import './App.css'
import { ConvertParams } from './types'
import { UploadArea } from './components/UploadArea'
import { Controls } from './components/Controls'
import { Preview } from './components/Preview'

const DEFAULT_PARAMS: ConvertParams = {
  threshold: 128,
  smoothing: 0.2,
  invert: false,
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [params, setParams] = useState<ConvertParams>(DEFAULT_PARAMS)
  const [svgUrl, setSvgUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setSvgUrl(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('threshold', String(params.threshold))
    formData.append('smoothing', String(params.smoothing))
    formData.append('invert', String(params.invert))

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const detail = await response.text()
        throw new Error(detail || `HTTP ${response.status}`)
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setSvgUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>SVG 변환기</h1>
        <p>이미지를 업로드하면 채워진 SVG 경로로 따라 그립니다.</p>
      </header>
      <main>
        <UploadArea file={file} onFileChange={setFile} />
        <Controls params={params} onChange={setParams} />
        <button
          className="convert-button"
          onClick={handleConvert}
          disabled={!file || loading}
        >
          {loading ? '변환 중...' : 'SVG로 변환'}
        </button>
        {error && <div className="error">{error}</div>}
        <Preview svgUrl={svgUrl} />
      </main>
    </div>
  )
}

export default App
