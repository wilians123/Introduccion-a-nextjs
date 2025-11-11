import { ApiClient } from './api-client';

// Tipos para Pedido
export interface ItemPedido {
  id?: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  codigoPedido: string;
  items: ItemPedido[];
  subtotal: number;
  impuestos: number;
  total: number;
}

export interface PedidoInput {
  clienteId: number;
  items: ItemPedido[];
}

export interface PedidosResponse {
  content: Pedido[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Servicio para gestionar Pedidos del Componente A
 */
export class PedidosService {
  /**
   * Listar pedidos con paginación
   */
  static async listarPedidos(
    page: number = 0,
    size: number = 10,
    clienteId?: number
  ): Promise<PedidosResponse> {
    let url = `/pedidos?page=${page}&size=${size}`;
    if (clienteId) {
      url += `&clienteId=${clienteId}`;
    }
    return ApiClient.getFromComponenteA<PedidosResponse>(url);
  }

  /**
   * Obtener un pedido por ID
   */
  static async obtenerPedido(id: number): Promise<Pedido> {
    return ApiClient.getFromComponenteA<Pedido>(`/pedidos/${id}`);
  }

  /**
   * Crear un nuevo pedido
   */
  static async crearPedido(pedido: PedidoInput): Promise<Pedido> {
    return ApiClient.postToComponenteA<Pedido>('/pedidos', pedido);
  }

  /**
   * Calcular total de un pedido
   */
  static async calcularTotal(id: number): Promise<{
    pedidoId: number;
    subtotal: number;
    impuestos: number;
    total: number;
  }> {
    return ApiClient.getFromComponenteA(`/pedidos/${id}/calcular-total`);
  }
}