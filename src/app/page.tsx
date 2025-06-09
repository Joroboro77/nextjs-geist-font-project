import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      title: "Recetas Guardadas",
      description: "Accede a todas tus recetas guardadas en un solo lugar",
      href: "/recetas"
    },
    {
      title: "Nueva Receta",
      description: "Agrega una nueva receta manualmente",
      href: "/nueva-receta"
    },
    {
      title: "OCR",
      description: "Escanea recetas en papel usando la cámara",
      href: "/ocr"
    },
    {
      title: "Asistente IA",
      description: "Obtén ayuda y sugerencias de nuestro asistente virtual",
      href: "/asistente-ia"
    },
    {
      title: "Importar/Exportar",
      description: "Gestiona tus recetas mediante archivos JSON",
      href: "/import-export"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Bienvenido a Recetario</h1>
        <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
          Tu asistente personal para gestionar todas tus recetas favoritas de manera fácil y eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
