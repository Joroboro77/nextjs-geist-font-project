"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  createdAt: string
}

export default function RecetasPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const loadRecipes = () => {
      try {
        const savedRecipes = localStorage.getItem("recipes")
        if (savedRecipes) {
          const parsed = JSON.parse(savedRecipes)
          if (Array.isArray(parsed)) {
            setRecipes(parsed)
          } else {
            console.error("Saved recipes is not an array:", parsed)
            setRecipes([])
          }
        }
      } catch (err) {
        console.error("Error loading recipes:", err)
        setRecipes([])
      }
    }
    loadRecipes()
  }, [])

  if (recipes.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">No hay recetas guardadas</h1>
        <p className="text-muted-foreground">
          Comienza agregando tu primera receta
        </p>
        <Link href="/nueva-receta">
          <Button>Agregar Receta</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Recetas</h1>
        <Link href="/nueva-receta">
          <Button>Nueva Receta</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
              <CardDescription>
                {recipe.ingredients.length} ingredientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {recipe.ingredients.slice(0, 3).join(", ")}
                {recipe.ingredients.length > 3 && "..."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
