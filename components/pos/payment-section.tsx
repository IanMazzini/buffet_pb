'use client'

import { Banknote, CreditCard, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { usePOS } from '@/lib/pos-context'
import { formatearPrecio, type MetodoPago } from '@/lib/pos-data'
import { cn } from '@/lib/utils'

export function PaymentSection() {
  const { 
    metodoPago, 
    setMetodoPago, 
    montoRecibido, 
    setMontoRecibido,
    totalCarrito,
    vuelto,
    puedeConfirmar,
    procesarPago,
    isProcessingPayment,
    carrito
  } = usePOS()

  const montoNumerico = parseFloat(montoRecibido) || 0
  const montoInsuficiente = metodoPago === 'efectivo' && montoNumerico > 0 && montoNumerico < totalCarrito

  if (carrito.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      {/* Payment method selector */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Medio de Pago
        </p>
        <div className="grid grid-cols-2 gap-2">
          <PaymentMethodButton
            method="efectivo"
            currentMethod={metodoPago}
            onClick={() => setMetodoPago('efectivo')}
            icon={<Banknote className="size-4" />}
            label="Efectivo"
          />
          <PaymentMethodButton
            method="transferencia"
            currentMethod={metodoPago}
            onClick={() => setMetodoPago('transferencia')}
            icon={<CreditCard className="size-4" />}
            label="Transferencia"
          />
        </div>
      </div>

      {/* Cash input */}
      {metodoPago === 'efectivo' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
              ¿Con cuánto abona?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                value={montoRecibido}
                onChange={(e) => setMontoRecibido(e.target.value)}
                placeholder="0"
                className={cn(
                  'pl-7 text-lg h-12 font-medium',
                  montoInsuficiente && 'border-destructive focus-visible:border-destructive'
                )}
              />
            </div>
            {montoInsuficiente && (
              <p className="text-xs text-destructive mt-1">
                El monto es menor al total
              </p>
            )}
          </div>
          
          {montoNumerico >= totalCarrito && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-700">Vuelto a dar:</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatearPrecio(vuelto)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm button */}
      <Button
        size="lg"
        className="w-full h-14 text-lg font-semibold gap-2"
        disabled={!puedeConfirmar || isProcessingPayment}
        onClick={procesarPago}
      >
        {isProcessingPayment ? (
          <>
            <Spinner className="size-5" />
            Procesando...
          </>
        ) : (
          <>
            Confirmar Pago
            <ArrowRight className="size-5" />
          </>
        )}
      </Button>
    </div>
  )
}

interface PaymentMethodButtonProps {
  method: MetodoPago
  currentMethod: MetodoPago
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function PaymentMethodButton({ 
  method, 
  currentMethod, 
  onClick, 
  icon, 
  label 
}: PaymentMethodButtonProps) {
  const isSelected = method === currentMethod
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all',
        isSelected 
          ? 'border-primary bg-primary/5 text-primary' 
          : 'border-border text-muted-foreground hover:border-primary/50'
      )}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  )
}
