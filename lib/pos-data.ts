// Types for the POS system
export interface Producto {
  id: string
  nombre: string
  precio: number
  stock: number
  categoria: string
}

export interface ItemCarrito {
  producto: Producto
  cantidad: number
}

export type MetodoPago = 'efectivo' | 'transferencia'

// Mock data - simulates data that would come from Google Sheets
export const productosIniciales: Producto[] = [
  { id: '1', nombre: 'Hamburguesa Clásica', precio: 4500, stock: 25, categoria: 'Hamburguesas' },
  { id: '2', nombre: 'Hamburguesa Doble', precio: 6000, stock: 20, categoria: 'Hamburguesas' },
  { id: '3', nombre: 'Hamburguesa Veggie', precio: 4800, stock: 15, categoria: 'Hamburguesas' },
  { id: '4', nombre: 'Hot Dog', precio: 2500, stock: 30, categoria: 'Hot Dogs' },
  { id: '5', nombre: 'Hot Dog Completo', precio: 3500, stock: 25, categoria: 'Hot Dogs' },
  { id: '6', nombre: 'Papas Fritas', precio: 2000, stock: 40, categoria: 'Acompañamientos' },
  { id: '7', nombre: 'Papas con Cheddar', precio: 3000, stock: 2, categoria: 'Acompañamientos' },
  { id: '8', nombre: 'Aros de Cebolla', precio: 2500, stock: 20, categoria: 'Acompañamientos' },
  { id: '9', nombre: 'Coca-Cola 500ml', precio: 1500, stock: 50, categoria: 'Bebidas' },
  { id: '10', nombre: 'Sprite 500ml', precio: 1500, stock: 0, categoria: 'Bebidas' },
  { id: '11', nombre: 'Agua Mineral', precio: 1000, stock: 60, categoria: 'Bebidas' },
  { id: '12', nombre: 'Cerveza Artesanal', precio: 3000, stock: 35, categoria: 'Bebidas' },
]

// Counter for order numbers (in a real app this would be stored in the database)
let contadorPedido = 41

export function obtenerSiguienteNumeroPedido(): string {
  contadorPedido++
  return contadorPedido.toString().padStart(3, '0')
}

// Simulated async functions with latency
export async function fetchProductos(): Promise<Producto[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800))
  return [...productosIniciales]
}

export async function sincronizarDatos(): Promise<Producto[]> {
  // Simulate network latency for sync
  await new Promise(resolve => setTimeout(resolve, 1200))
  // In a real app, this would fetch fresh data from Google Sheets
  return [...productosIniciales]
}

export async function confirmarVenta(
  items: ItemCarrito[],
  metodoPago: MetodoPago,
  montoRecibido?: number
): Promise<{ exito: boolean; numeroPedido: string }> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // In a real app, this would:
  // 1. Update the stock in Google Sheets
  // 2. Record the sale
  // 3. Return the order number
  
  const numeroPedido = obtenerSiguienteNumeroPedido()
  
  return {
    exito: true,
    numeroPedido
  }
}

// Format currency for Argentina
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio)
}
