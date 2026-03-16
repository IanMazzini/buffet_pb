'use client'

import { CheckCircle, RotateCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePOS } from '@/lib/pos-context'
import { formatearPrecio } from '@/lib/pos-data'

export function SuccessModal() {
  const { 
    showSuccessModal, 
    cerrarModalExito, 
    lastOrderNumber, 
    lastOrderItems 
  } = usePOS()

  const total = lastOrderItems.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad, 
    0
  )

  return (
    <Dialog open={showSuccessModal} onOpenChange={cerrarModalExito}>
      <DialogContent 
        className="sm:max-w-md" 
        showCloseButton={false}
      >
        <DialogHeader className="text-center sm:text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-emerald-100">
              <CheckCircle className="size-10 text-emerald-600" />
            </div>
          </div>
          <DialogTitle className="text-xl">¡Pago Confirmado!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order number - HUGE */}
          <div className="bg-muted rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Número de Pedido
            </p>
            <p className="text-6xl md:text-7xl font-black text-foreground tracking-tight">
              #{lastOrderNumber}
            </p>
          </div>
          
          {/* Order summary */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Resumen del pedido
            </p>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {lastOrderItems.map(item => (
                <div 
                  key={item.producto.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">
                    <span className="font-semibold">{item.cantidad}x</span>{' '}
                    {item.producto.nombre}
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {formatearPrecio(item.producto.precio * item.cantidad)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-primary text-lg">
                  {formatearPrecio(total)}
                </span>
              </div>
            </div>
          </div>
          
          {/* New sale button */}
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-semibold gap-2"
            onClick={cerrarModalExito}
          >
            <RotateCcw className="size-5" />
            Nueva Venta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
