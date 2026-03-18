// Types for the POS system
export interface Producto {
  id: string
  nombre: string
  precio: number
  stock: number
  categoria: string
  componentes?: string // <-- ACÁ ESTÁ EL CAMBIO: Agregamos componentes como opcional
}

export interface ItemCarrito {
  producto: Producto
  cantidad: number
}

export type MetodoPago = 'efectivo' | 'transferencia'

// Format currency for Argentina
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio)
}

// ============================================================================
// DATOS SIMULADOS (MOCKS) DEPRECADOS
// Mantenemos las firmas de estas funciones y variables por si algún componente 
// de la UI original de v0 las está importando, pero tu app ya no las usa 
// porque se conecta directo a Google Sheets desde pos-context.tsx
// ============================================================================

export const productosIniciales: Producto[] = []

let contadorPedido = 41

export function obtenerSiguienteNumeroPedido(): string {
  contadorPedido++
  return contadorPedido.toString().padStart(3, '0')
}

export async function fetchProductos(): Promise<Producto[]> {
  return []
}

export async function sincronizarDatos(): Promise<Producto[]> {
  return []
}

export async function confirmarVenta(
  items: ItemCarrito[],
  metodoPago: MetodoPago,
  montoRecibido?: number
): Promise<{ exito: boolean; numeroPedido: string }> {
  return { exito: true, numeroPedido: "000" }
}