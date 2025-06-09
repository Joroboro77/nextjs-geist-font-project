"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createWorker } from "tesseract.js"

export default function OcrPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState("")
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setCameraActive(true)
      setError("")
    } catch (err) {
      setError("Error al acceder a la cámara. Por favor, permite el acceso a la cámara.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setCameraActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        return canvasRef.current.toDataURL("image/png")
      }
    }
    return null
  }

  const scanImage = async () => {
    const imageData = captureImage()
    if (!imageData) {
      setError("Error al capturar la imagen")
      return
    }

    setScanning(true)
    setError("")

    try {
      const worker = await createWorker("spa")
      const { data: { text } } = await worker.recognize(imageData)
      await worker.terminate()
      setResult(text)
      stopCamera()
    } catch (err) {
      setError("Error al procesar la imagen. Por favor, intenta de nuevo.")
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Escanear Receta</CardTitle>
          <CardDescription>
            Usa la cámara para escanear una receta en papel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            />
            <canvas ref={canvasRef} className="hidden" />
            {!cameraActive && !result && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Presiona "Iniciar Cámara" para comenzar
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {!cameraActive && !result && (
              <Button onClick={startCamera}>
                Iniciar Cámara
              </Button>
            )}

            {cameraActive && (
              <>
                <Button onClick={scanImage} disabled={scanning}>
                  {scanning ? "Escaneando..." : "Capturar y Escanear"}
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Detener Cámara
                </Button>
              </>
            )}
          </div>

          {result && (
            <div className="space-y-2">
              <h3 className="font-medium">Texto Reconocido:</h3>
              <div className="p-4 rounded-lg bg-muted">
                <pre className="whitespace-pre-wrap">{result}</pre>
              </div>
              <Button onClick={() => {
                setResult("")
                startCamera()
              }}>
                Escanear Otra Vez
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
