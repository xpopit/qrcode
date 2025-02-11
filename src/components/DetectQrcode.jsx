import React, { useState } from 'react'

function DetectQrcode({ imageUrl, isImageProcessing }) {
  const [qrResult, setQrResult] = useState(null)
  const [error, setError] = useState(null)

  return (
    <div className="detect-controls">
      {error && (
        <div className="detect-error">
          {error}
        </div>
      )}

      {qrResult && (
        <div className="detect-result">
          <div className="result-type">
            ประเภท: {qrResult.type === 'url' ? 'URL' : 'ข้อความ'}
          </div>
          <div className="result-value">
            {qrResult.type === 'url' ? (
              <a 
                href={qrResult.value} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {qrResult.value}
              </a>
            ) : (
              qrResult.value
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetectQrcode
