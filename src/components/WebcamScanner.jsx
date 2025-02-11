import React, { useEffect, useRef, useState } from 'react'
import { scan } from 'qr-scanner-wechat'

function WebcamScanner({ onQrCodeDetected }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const isMounted = useRef(true)

  const handleDetectClick = async () => {
    if (!videoRef.current || !hasCamera) return;

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      
      const result = await scan(canvas)
      if (result?.text) {
        setStatus(`ตรวจพบ QR Code: ${result.text}`)
        onQrCodeDetected({ 
          getInfos: () => [{ data: result.text }] 
        })
      } else {
        setStatus('ไม่พบ QR Code')
      }
    } catch (error) {
      console.error('QR code scanning error:', error)
      setStatus('เกิดข้อผิดพลาดในการตรวจจับ QR code')
    }
  }

  const toggleScanning = () => {
    if (!hasCamera) {
      setStatus('ไม่พบกล้อง กรุณาอนุญาตการเข้าถึงกล้อง')
      return
    }
    setIsScanning(prev => !prev)
  }

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: 512,
            height: 512,
          },
        })
        
        if (!isMounted.current) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setHasCamera(true)
          setStatus('พร้อมสแกน QR Code')
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        if (error.name === 'NotAllowedError') {
          setStatus('กรุณาอนุญาตการเข้าถึงกล้อง')
        } else if (error.name === 'NotFoundError') {
          setStatus('ไม่พบกล้องบนอุปกรณ์นี้')
        } else {
          setStatus('ไม่สามารถเข้าถึงกล้องได้')
        }
        setHasCamera(false)
      }
    }

    setupCamera()

    return () => {
      isMounted.current = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    let intervalId = null

    if (isScanning && hasCamera) {
      intervalId = setInterval(handleDetectClick, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isScanning, hasCamera])

  return (
    <div id="video-container">
      <video 
        ref={videoRef} 
        style={{ width: '100%', maxWidth: '512px' }}
        playsInline
      />
      <div className="controls">
        <button 
          onClick={handleDetectClick} 
          className="detect-button"
          disabled={!hasCamera}
        >
          ตรวจจับ QR Code
        </button>
        <button 
          onClick={toggleScanning} 
          className={`detect-button ${isScanning ? 'active' : ''}`}
          disabled={!hasCamera}
        >
          {isScanning ? 'หยุดสแกนอัตโนมัติ' : 'เริ่มสแกนอัตโนมัติ'}
        </button>
      </div>
      {status && (
        <div className="status-text">
          {status}
        </div>
      )}
    </div>
  )
}

export default WebcamScanner