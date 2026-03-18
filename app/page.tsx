import { POSProvider } from '@/lib/pos-context'
import { Header } from '@/components/pos/header'
import { ProductCatalog } from '@/components/pos/product-catalog'
import { Cart } from '@/components/pos/cart'
import { SuccessModal } from '@/components/pos/success-modal'

export default function POSPage() {
  return (
    <POSProvider>
      {/* Usamos min-h-screen en móviles para que crezca libremente, 
        y limitamos a h-screen (altura exacta) solo en pantallas grandes (lg)
      */}
      <div className="flex flex-col min-h-screen lg:h-screen bg-background">
        <Header />

        {/* En celular se apilan (flex-col). En PC se ponen lado a lado (lg:flex-row)
          lg:overflow-hidden previene el doble scroll en escritorio.
        */}
        <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">

          {/* CONTENEDOR DEL CATÁLOGO 
            min-h-[60vh] fuerza a que en el celu ocupe al menos el 60% de la pantalla 
            antes de mostrar el carrito, evitando que desaparezca.
          */}
          <div className="flex-1 min-h-[60vh] lg:min-h-0 lg:overflow-y-auto">
            <ProductCatalog />
          </div>

          {/* CONTENEDOR DEL CARRITO 
            En celu ocupa el 100% de ancho. En PC le fijamos un ancho de 400px.
            Le agregamos un border-t (borde superior) para separarlo de los productos en móvil.
          */}
          <div className="w-full lg:w-[400px] xl:w-[450px] min-h-[50vh] lg:min-h-0 shrink-0 border-t lg:border-t-0 lg:border-l lg:overflow-y-auto bg-slate-50 dark:bg-slate-900 lg:bg-transparent">
            <Cart />
          </div>

        </div>
        <SuccessModal />
      </div>
    </POSProvider>
  )
}