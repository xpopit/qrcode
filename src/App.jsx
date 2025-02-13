import React, { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('')
  const [detectedImages, setDetectedImages] = useState([])
  const canvasRef = useRef(null)
  // const cvQrRef = useRef(null)

  useEffect(() => {
    // แก้ไขการเรียกใช้ OpencvQr จาก global
    // if (window.OpencvQr) {
    //   cvQrRef.current = new window.OpencvQr({
    //     dw: "https://leidenglai.github.io/opencv-js-qrcode/models/detect.caffemodel",
    //     sw: "https://leidenglai.github.io/opencv-js-qrcode/models/sr.caffemodel",
    //   })
    // }
  }, [])

  const loadImageToCanvas = (url) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"
    img.onload = function () {
      const { width, height } = img
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)
    }
    img.src = url
  }

  const imagedataToImage = (imagedata) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = imagedata.width
    canvas.height = imagedata.height
    ctx?.putImageData(imagedata, 0, 0)

    const image = new Image()
    image.src = canvas.toDataURL()
    return image
  }

  const handleDetectClick = () => {
    const result = window.cvQr.load("canvasInput")
    
    const infos = result?.getInfos()
    setStatus(JSON.stringify(infos))

    const images = result?.getImages()
    if (images) {
      const convertedImages = images.map(imgData => imagedataToImage(imgData))
      setDetectedImages(convertedImages)
    }
  }

  const handleClearClick = () => {
    window.cvQr.clear()
    setDetectedImages([])
    setStatus('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const qrcodeUrl = URL.createObjectURL(file)
      loadImageToCanvas(qrcodeUrl)
      setTimeout(() => {
        handleDetectClick()
      }, 100)
    }
  }

  return (
    <div className="App">
      <input 
        type="file" 
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        style={{ maxWidth: "400px" }}
      />
      <canvas 
        ref={canvasRef} 
        id="canvasInput"
        style={{ maxWidth: "4oopx" }}
      ></canvas>
      
      <div>
        
        <button onClick={handleClearClick}>ล้างข้อมูล</button>
      </div>

      <div>สถานะ: {status}</div>

      <div id="imageWrap">
        {detectedImages.map((img, index) => (
          <img 
            key={index} 
            src={img.src} 
            alt={`Detected QR ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default App 