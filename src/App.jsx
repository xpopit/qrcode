import React, { useEffect, useRef, useState } from 'react'
import p5 from 'p5'
import { BrowserMultiFormatReader } from '@zxing/library'
import './App.css'

function App() {
  const [qrResult, setQrResult] = useState('')
  const [zoom, setZoom] = useState(1)
  const videoRef = useRef(null)
  const codeReader = useRef(new BrowserMultiFormatReader())

  useEffect(() => {
    let myP5 = new p5((sketch) => {
      let capture

      sketch.setup = () => {
        const canvas = sketch.createCanvas(640, 480)
        canvas.parent(videoRef.current)
        capture = sketch.createCapture(sketch.VIDEO)
        capture.hide()

        // Start QR code scanning
        codeReader.current.decodeFromVideoDevice(
          null,
          'video',
          (result, err) => {
            if (result) {
              const text = result.getText()
              console.log('QR Code detected:', text)
              setQrResult(text)
            }
            if (err && err.name !== 'NotFoundException') {
              console.error('QR Code scanning error:', err)
            }
          }
        )
      }

      sketch.draw = () => {
        sketch.push()
        sketch.scale(zoom)
        sketch.image(capture, 0, 0, sketch.width / zoom, sketch.height / zoom)
        sketch.pop()

        // Draw zoom guide
        sketch.push()
        sketch.noFill()
        sketch.stroke(255)
        sketch.strokeWeight(2)
        sketch.rect(sketch.width/2 - 100, sketch.height/2 - 100, 200, 200)
        sketch.pop()
      }
    })

    return () => {
      codeReader.current.reset()
      myP5.remove()
    }
  }, [zoom])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 1))
  }

  return (
    <div className="App">
      <h1>QR Code Scanner</h1>
      <div className="controls">
        <button onClick={handleZoomOut}>Zoom Out (-)</button>
        <span className="zoom-level">Zoom: {zoom.toFixed(1)}x</span>
        <button onClick={handleZoomIn}>Zoom In (+)</button>
      </div>
      <div ref={videoRef} id="video-container">
        <video id="video"></video>
      </div>
      <div id="result">
        {qrResult ? (
          <p>Scanned QR Code: {qrResult}</p>
        ) : (
          <p>กำลังค้นหา QR Code...</p>
        )}
      </div>
    </div>
  )
}

export default App 