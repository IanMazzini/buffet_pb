'use client'

import { Plus, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type Producto, formatearPrecio } from '@/lib/pos-data'
import { usePOS } from '@/lib/pos-context'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const { agregarAlCarrito, carrito } = usePOS()
  const sinStock = producto.stock <= 0
  const cantidadEnCarrito = carrito.find(item => item.producto.id === producto.id)?.cantidad ?? 0
  const stockDisponible = producto.stock - cantidadEnCarrito

  const handleClick = () => {
    if (!sinStock && stockDisponible > 0) {
      agregarAlCarrito(producto)
    }
  }

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-200 py-4',
        sinStock
          ? 'grayscale opacity-60 cursor-not-allowed'
          : 'hover:shadow-md hover:border-primary/50 active:scale-[0.98]'
      )}
      onClick={handleClick}
    >
      {sinStock && (
        <Badge
          variant="destructive"
          className="absolute top-2 right-2 text-xs"
        >
          SIN STOCK
        </Badge>
      )}

      {cantidadEnCarrito > 0 && !sinStock && (
        <Badge
          className="absolute top-2 right-2 bg-primary text-primary-foreground"
        >
          {cantidadEnCarrito} en carrito
        </Badge>
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm md:text-base truncate">
              {producto.nombre}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {producto.categoria}
            </p>
          </div>

          {!sinStock && (
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary shrink-0">
              <Plus className="size-4" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-lg font-bold text-foreground">
            {formatearPrecio(producto.precio)}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="size-3.5" />
            {/* ACÁ ESTÁ EL CAMBIO VISUAL */}
            {producto.componentes ? (
              <span className="text-xs font-medium text-blue-600">
                Combo
              </span>
            ) : (
              <span className="text-xs">
                {sinStock ? '0' : stockDisponible} disp.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}