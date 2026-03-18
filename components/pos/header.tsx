'use client'

import { RefreshCw, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePOS } from '@/lib/pos-context'

export function Header() {
  const { sincronizar, isSyncing } = usePOS()

  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary">
            <Store className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground md:text-xl">Piedrabuena POS</h1>
            <p className="text-xs text-muted-foreground">Sistema de Punto de Venta</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={sincronizar}
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sincronizar Datos</span>
          <span className="sm:hidden">Sync</span>
        </Button>
      </div>
    </header>
  )
}
