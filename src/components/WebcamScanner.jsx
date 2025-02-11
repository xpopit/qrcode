import React, { useEffect, useRef, useState } from 'react'
import etro from "etro"

function WebcamScanner({ onQrCodeDetected }) {
  const canvasRef = useRef(null)
  const movieRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('')
  const [detectedImages, setDetectedImages] = useState([])

  const imagedataToImage = (imagedata) => {
    const canvas = document.createElement('canvas')
    canvas.width = imagedata.width
    canvas.height = imagedata.height
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imagedata, 0, 0)
    return canvas.toDataURL()
  }

  const handleDetectClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (window.cvQr) {
        const result = window.cvQr.load(canvas)
        const infos = result?.getInfos()
        setStatus(JSON.stringify(infos))

        const images = result?.getImages()
        if (images) {
          const convertedImages = images.map(imgData => imagedataToImage(imgData))
          setDetectedImages(convertedImages)
        }
        if (result) {
          onQrCodeDetected(result)
        }
      }
    } catch (error) {
      console.error('QR code scanning error:', error)
      setStatus('เกิดข้อผิดพลาดในการตรวจจับ QR code')
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const movie = new etro.Movie({ canvas });
    movieRef.current = movie;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        const video = document.createElement("video");
        video.srcObject = stream;
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video);
          };
        });
      })
      .then((video) => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const layer = new etro.layer.Video({
          startTime: 0,
          source: video,
        });
        movie.addLayer(layer);
        movie.play();
      });

    return () => {
      if (movieRef.current) {
        movieRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div id="video-container">
      <canvas ref={canvasRef} id="qr-canvas"></canvas>
      <button onClick={handleDetectClick} className="detect-button">
        ตรวจจับ QR Code
      </button>
      {status && (
        <div className="status-text">
          สถานะ: {status}
        </div>
      )}
      {detectedImages.length > 0 && (
        <div className="detected-images">
          {detectedImages.map((imgUrl, index) => (
            <img 
              key={index} 
              src={imgUrl} 
              alt={`Detected QR ${index + 1}`}
              className="detected-image"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WebcamScanner