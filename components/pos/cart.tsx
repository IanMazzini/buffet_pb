'use client'

import { ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePOS } from '@/lib/pos-context'
import { formatearPrecio } from '@/lib/pos-data'
import { CartItem } from './cart-item'
import { PaymentSection } from './payment-section'

export function Cart() {
  const { carrito, totalCarrito, vaciarCarrito } = usePOS()

  return (
    <div className="w-full lg:w-96 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-5 text-primary" />
          <h2 className="font-semibold text-foreground">Comanda</h2>
          {carrito.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </div>
        
        {carrito.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={vaciarCarrito}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4 mr-1" />
            Vaciar
          </Button>
        )}
      </div>
      
      {/* Cart items */}
      <div className="flex-1 overflow-auto p-4">
        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <ShoppingCart className="size-12 mb-3 opacity-30" />
            <p className="font-medium">Carrito vacío</p>
            <p className="text-sm">Seleccioná productos del catálogo</p>
          </div>
        ) : (
          <div>
            {carrito.map(item => (
              <CartItem key={item.producto.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer with total and payment */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatearPrecio(totalCarrito)}
          </span>
        </div>
        
        <PaymentSection />
      </div>
    </div>
  )
}
