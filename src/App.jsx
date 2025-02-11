import React, { useState } from 'react'
import './App.css'
import WebcamScanner from './components/WebcamScanner'

function App() {
  const [qrCodeInfo, setQrCodeInfo] = useState('กำลังตรวจจับ QR code...')

  // ฟังก์ชันรับข้อมูล QR code
  const handleQrCodeDetected = (result) => {
    const infos = result?.getInfos()
    if (infos && infos.length > 0) {
      setQrCodeInfo(infos[0]?.data || 'ไม่พบข้อมูล QR code')
      console.log(infos[0]?.data)
    } else {
      setQrCodeInfo('กำลังตรวจจับ QR code...')
    }
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">Webcam QR Scanner</h1>
        <div className="content">
          <div className="webcam-section">
            <WebcamScanner onQrCodeDetected={handleQrCodeDetected} />
          </div>
        </div>
        <div className="preview-text">
          {qrCodeInfo}
        </div>
      </div>
    </div>
  )
}

export default App 