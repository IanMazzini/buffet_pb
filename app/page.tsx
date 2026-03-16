import { POSProvider } from '@/lib/pos-context'
import { Header } from '@/components/pos/header'
import { ProductCatalog } from '@/components/pos/product-catalog'
import { Cart } from '@/components/pos/cart'
import { SuccessModal } from '@/components/pos/success-modal'

export default function POSPage() {
  return (
    <POSProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          <ProductCatalog />
          <Cart />
        </div>
        <SuccessModal />
      </div>
    </POSProvider>
  )
}
