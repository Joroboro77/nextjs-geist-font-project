"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Recetario
            </Link>
            <div className="hidden md:flex space-x-2">
            <Button asChild variant="ghost">
              <Link href="/recetas">Recetas Guardadas</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/nueva-receta">Nueva Receta</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/ocr">OCR</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/asistente-ia">Asistente IA</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/import-export">Importar/Exportar</Link>
            </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
