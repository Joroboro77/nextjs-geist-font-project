"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AsistenteIaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente culinario. Puedo ayudarte con recetas, técnicas de cocina, sustitución de ingredientes y más. ¿En qué puedo ayudarte hoy?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Simulate AI response with cooking-related information
      // In a real application, this would make an API call to an AI service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let response = "Lo siento, no puedo procesar tu solicitud en este momento."
      
      if (userMessage.toLowerCase().includes("receta")) {
        response = "Para crear una nueva receta, puedes ir a la sección 'Nueva Receta' y llenar el formulario con los ingredientes y pasos necesarios."
      } else if (userMessage.toLowerCase().includes("ingrediente")) {
        response = "La sustitución de ingredientes depende del plato específico. ¿Podrías decirme qué ingrediente quieres sustituir y en qué receta?"
      } else if (userMessage.toLowerCase().includes("tiempo")) {
        response = "Los tiempos de cocción pueden variar según varios factores como la temperatura, el tamaño de los ingredientes y tu equipo de cocina."
      } else {
        response = "Puedo ayudarte con preguntas sobre recetas, ingredientes, técnicas de cocina y más. ¿Podrías ser más específico?"
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Asistente IA</CardTitle>
          <CardDescription>
            Pregúntame sobre recetas, técnicas de cocina o ingredientes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    Escribiendo...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
