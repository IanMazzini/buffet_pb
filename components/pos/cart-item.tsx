'use client'

import { Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type ItemCarrito, formatearPrecio } from '@/lib/pos-data'
import { usePOS } from '@/lib/pos-context'

interface CartItemProps {
  item: ItemCarrito
}

export function CartItem({ item }: CartItemProps) {
  const { agregarAlCarrito, quitarDelCarrito, eliminarDelCarrito, productos } = usePOS()
  const { producto, cantidad } = item
  
  const stockDisponible = productos.find(p => p.id === producto.id)?.stock ?? 0
  const puedeAgregar = cantidad < stockDisponible

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate">
          {producto.nombre}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatearPrecio(producto.precio)} c/u
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => quitarDelCarrito(producto.id)}
          className="size-8"
        >
          <Minus className="size-3" />
        </Button>
        
        <span className="w-8 text-center font-medium text-foreground">
          {cantidad}
        </span>
        
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => agregarAlCarrito(producto)}
          disabled={!puedeAgregar}
          className="size-8"
        >
          <Plus className="size-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => eliminarDelCarrito(producto.id)}
          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
      
      <div className="w-20 text-right">
        <span className="font-semibold text-foreground">
          {formatearPrecio(producto.precio * cantidad)}
        </span>
      </div>
    </div>
  )
}
