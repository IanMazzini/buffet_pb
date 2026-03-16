'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { 
  type Producto, 
  type ItemCarrito, 
  type MetodoPago,
  confirmarVenta
} from './pos-data'

const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxfBA3TgLq51OHt-En-nP4yV1Zq-n96ScunCpjwt-gpKd77h0mLLzJhFjq2TbPoRnk/exec"

interface POSContextType {
  productos: Producto[]
  carrito: ItemCarrito[]
  metodoPago: MetodoPago
  montoRecibido: string
  isSyncing: boolean
  isProcessingPayment: boolean
  showSuccessModal: boolean
  lastOrderNumber: string
  lastOrderItems: ItemCarrito[]
  
  // Actions
  agregarAlCarrito: (producto: Producto) => void
  quitarDelCarrito: (productoId: string) => void
  eliminarDelCarrito: (productoId: string) => void
  vaciarCarrito: () => void
  setMetodoPago: (metodo: MetodoPago) => void
  setMontoRecibido: (monto: string) => void
  sincronizar: () => Promise<void>
  procesarPago: () => Promise<void>
  cerrarModalExito: () => void
  
  // Computed
  totalCarrito: number
  vuelto: number
  puedeConfirmar: boolean
}

const POSContext = createContext<POSContextType | null>(null)

export function POSProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [montoRecibido, setMontoRecibido] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastOrderNumber, setLastOrderNumber] = useState('')
  const [lastOrderItems, setLastOrderItems] = useState<ItemCarrito[]>([])

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad, 
    0
  )

  const montoNumerico = parseFloat(montoRecibido) || 0
  const vuelto = metodoPago === 'efectivo' ? Math.max(0, montoNumerico - totalCarrito) : 0
  
  const puedeConfirmar = carrito.length > 0 && (
    metodoPago === 'transferencia' || 
    (metodoPago === 'efectivo' && montoNumerico >= totalCarrito)
  )

  // --- NUEVA FUNCIÓN PARA CARGAR DESDE GOOGLE SHEETS ---
  const cargarProductos = async () => {
    try {
      const respuesta = await fetch(GOOGLE_API_URL)
      const datos = await respuesta.json()
      
      const productosFormateados = datos.map((p: any) => ({
        ...p,
        id: p.id.toString(), // Aseguramos que el ID sea string
        precio: Number(p.precio),
        stock: Number(p.stock)
      }))
      
      setProductos(productosFormateados)
    } catch (error) {
      console.error("Error cargando productos desde Sheets:", error)
    }
  }

  // Hook para que cargue los datos al abrir la página
  useEffect(() => {
    cargarProductos()
  }, [])
  // -----------------------------------------------------

  const agregarAlCarrito = useCallback((producto: Producto) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.producto.id === producto.id)
      
      // Check stock
      const cantidadActual = existente ? existente.cantidad : 0
      const stockDisponible = productos.find(p => p.id === producto.id)?.stock ?? 0
      
      if (cantidadActual >= stockDisponible) {
        return prev
      }
      
      if (existente) {
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
  }, [productos])

  const quitarDelCarrito = useCallback((productoId: string) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.producto.id === productoId)
      if (!existente) return prev
      
      if (existente.cantidad === 1) {
        return prev.filter(item => item.producto.id !== productoId)
      }
      
      return prev.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    })
  }, [])

  const eliminarDelCarrito = useCallback((productoId: string) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId))
  }, [])

  const vaciarCarrito = useCallback(() => {
    setCarrito([])
    setMontoRecibido('')
    setMetodoPago('efectivo')
  }, [])

  // Sincronizar ahora llama a tu API real
  const sincronizar = useCallback(async () => {
    setIsSyncing(true)
    try {
      await cargarProductos()
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const procesarPago = useCallback(async () => {
    if (!puedeConfirmar) return
    
    setIsProcessingPayment(true)
    try {
      const resultado = await confirmarVenta(
        carrito,
        metodoPago,
        metodoPago === 'efectivo' ? montoNumerico : undefined
      )
      
      if (resultado.exito) {
        // Update local stock temporalmente para la UI
        setProductos(prev => 
          prev.map(producto => {
            const itemCarrito = carrito.find(item => item.producto.id === producto.id)
            if (itemCarrito) {
              return { ...producto, stock: producto.stock - itemCarrito.cantidad }
            }
            return producto
          })
        )
        
        setLastOrderNumber(resultado.numeroPedido)
        setLastOrderItems([...carrito])
        setShowSuccessModal(true)
      }
    } finally {
      setIsProcessingPayment(false)
    }
  }, [carrito, metodoPago, montoNumerico, puedeConfirmar])

  const cerrarModalExito = useCallback(() => {
    setShowSuccessModal(false)
    vaciarCarrito()
  }, [vaciarCarrito])

  return (
    <POSContext.Provider
      value={{
        productos,
        carrito,
        metodoPago,
        montoRecibido,
        isSyncing,
        isProcessingPayment,
        showSuccessModal,
        lastOrderNumber,
        lastOrderItems,
        agregarAlCarrito,
        quitarDelCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        setMetodoPago,
        setMontoRecibido,
        sincronizar,
        procesarPago,
        cerrarModalExito,
        totalCarrito,
        vuelto,
        puedeConfirmar,
      }}
    >
      {children}
    </POSContext.Provider>
  )
}

export function usePOS() {
  const context = useContext(POSContext)
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider')
  }
  return context
}