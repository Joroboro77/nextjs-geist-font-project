"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { v4 as uuidv4 } from "uuid"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  createdAt: string
}

export default function NuevaRecetaPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      setError("Por favor completa todos los campos")
      return
    }

    try {
      const newRecipe: Recipe = {
        id: uuidv4(),
        title: title.trim(),
        ingredients: ingredients
          .split("\n")
          .map(i => i.trim())
          .filter(i => i.length > 0),
        instructions: instructions.trim(),
        createdAt: new Date().toISOString()
      }

      // Get existing recipes
      let existingRecipes: Recipe[] = []
      try {
        const saved = localStorage.getItem("recipes")
        if (saved) {
          existingRecipes = JSON.parse(saved)
        }
      } catch (err) {
        console.error("Error loading existing recipes:", err)
      }

      // Ensure existingRecipes is an array
      if (!Array.isArray(existingRecipes)) {
        existingRecipes = []
      }
      
      // Add new recipe
      const updatedRecipes = [...existingRecipes, newRecipe]
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes))
      
      setSuccess(true)
      
      // Reset form
      setTitle("")
      setIngredients("")
      setInstructions("")

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/recetas")
      }, 1500)
    } catch (err) {
      console.error("Error saving recipe:", err)
      setError("Error al guardar la receta. Por favor intenta de nuevo.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Receta</CardTitle>
          <CardDescription>
            Agrega una nueva receta a tu colección
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>
                  ¡Receta guardada exitosamente! Redirigiendo...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Pasta Carbonara"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">
                Ingredientes (uno por línea)
              </Label>
              <Textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="200g pasta&#10;100g panceta&#10;2 huevos&#10;Queso parmesano"
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instrucciones</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Describe los pasos para preparar la receta..."
                rows={8}
              />
            </div>

            <Button type="submit" className="w-full">
              Guardar Receta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
