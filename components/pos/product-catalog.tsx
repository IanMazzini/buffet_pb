'use client'

import { usePOS } from '@/lib/pos-context'
import { ProductCard } from './product-card'

export function ProductCatalog() {
  const { productos } = usePOS()
  
  // Group products by category
  const productosPorCategoria = productos.reduce((acc, producto) => {
    if (!acc[producto.categoria]) {
      acc[producto.categoria] = []
    }
    acc[producto.categoria].push(producto)
    return acc
  }, {} as Record<string, typeof productos>)

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      <div className="space-y-6">
        {Object.entries(productosPorCategoria).map(([categoria, productosCategoria]) => (
          <div key={categoria}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {categoria}
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {productosCategoria.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
