"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  createdAt: string
}

export default function ImportExportPage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleExport = () => {
    try {
      const recipes = localStorage.getItem("recipes")
      if (!recipes) {
        setError("No hay recetas para exportar")
        return
      }

      // Create a Blob with the recipes data
      const blob = new Blob([recipes], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      
      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `mis-recetas-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess("Recetas exportadas exitosamente")
      setError("")
    } catch (err) {
      setError("Error al exportar las recetas")
      setSuccess("")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    setSuccess("")

    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const recipes = JSON.parse(text) as Recipe[]

      // Validate the imported data structure
      if (!Array.isArray(recipes)) {
        throw new Error("Formato de archivo inválido")
      }

      // Validate each recipe has the required fields
      recipes.forEach(recipe => {
        if (!recipe.id || !recipe.title || !Array.isArray(recipe.ingredients) || !recipe.instructions) {
          throw new Error("Una o más recetas tienen un formato inválido")
        }
      })

      // Save to localStorage
      localStorage.setItem("recipes", JSON.stringify(recipes))
      setSuccess("Recetas importadas exitosamente")

      // Reset the input
      e.target.value = ""
    } catch (err) {
      setError("Error al importar las recetas. Asegúrate de que el archivo tenga el formato correcto")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importar/Exportar Recetas</CardTitle>
          <CardDescription>
            Respalda tus recetas o impórtalas desde un archivo JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Exportar Recetas</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Descarga todas tus recetas en un archivo JSON
              </p>
              <Button onClick={handleExport}>
                Exportar Recetas
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Importar Recetas</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Selecciona un archivo JSON con tus recetas
              </p>
              <Input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Nota: Las recetas importadas reemplazarán las recetas existentes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
