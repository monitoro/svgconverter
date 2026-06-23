interface Props {
  svgUrl: string | null
}

export function Preview({ svgUrl }: Props) {
  if (!svgUrl) return null

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = svgUrl
    a.download = 'converted.svg'
    a.click()
  }

  return (
    <div className="preview">
      <h2>미리보기</h2>
      <img src={svgUrl} alt="변환된 SVG 미리보기" />
      <button onClick={handleDownload}>SVG 다운로드</button>
    </div>
  )
}
