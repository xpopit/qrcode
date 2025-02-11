import React, { useEffect, useState, useRef } from 'react'

function CapturedImage({ frameUrl, onQrCodeDetected }) {
  const [processedUrl, setProcessedUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [brightness, setBrightness] = useState(1.0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const processImage = async () => {
      if (!frameUrl) return

      const img = new Image()
      img.src = frameUrl
      
      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')

          ctx.drawImage(img, 0, 0, 200, 200)

          if (isProcessing) {
            const imageData = ctx.getImageData(0, 0, 200, 200)
            const data = imageData.data

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              
              let gray = 0.299 * r + 0.587 * g + 0.114 * b
              gray = ((gray / 255 - 0.5) * 2.0 + 0.5) * 255
              gray = gray * brightness
              gray = Math.min(255, Math.max(0, gray))

              data[i] = gray
              data[i + 1] = gray
              data[i + 2] = gray
            }

            ctx.putImageData(imageData, 0, 0)
          }

          try {
            if (window.cvQr) {
              const result = window.cvQr.load('qr-canvas')
              if (result && onQrCodeDetected) {
                onQrCodeDetected(result)
              }
            }
          } catch (error) {
            console.error('QR code scanning error:', error)
          }

          setProcessedUrl(canvas.toDataURL())
          resolve()
        }
      })
    }

    processImage()
  }, [frameUrl, isProcessing, brightness, onQrCodeDetected])

  return (
    <div className="captured-frame">
      <div className="frame-container">
        <img 
          src={processedUrl || frameUrl} 
          alt="Captured frame" 
          className="frame-image"
        />
        <canvas
          ref={canvasRef}
          id="qr-canvas"
          width="200"
          height="200"
          style={{ display: 'none' }}
        />
      </div>
      <div className="image-controls">
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={isProcessing}
              onChange={(e) => setIsProcessing(e.target.checked)}
            />
            เปิดใช้งานฟิลเตอร์ขาวดำ
          </label>
        </div>
        <div className="control-group">
          <label>
            ความสว่าง: {brightness.toFixed(1)}
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default CapturedImage 