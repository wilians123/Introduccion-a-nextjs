import { ApiClient } from './api-client';

// Tipos para Factura
export interface ItemFactura {
  id?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Factura {
  id: number;
  proveedorId: number;
  proveedorRazonSocial?: string;
  numeroFactura: string;
  codigoFactura: string;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: 'EMITIDA' | 'PAGADA' | 'VENCIDA' | 'CANCELADA';
  items: ItemFactura[];
  subtotal: number;
  impuestos: number;
  descuentos: number;
  total: number;
  metodoPago?: 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'TARJETA';
  referenciaPago?: string;
  observaciones?: string;
}

export interface FacturaInput {
  proveedorId: number;
  numeroFactura: string;
  fechaEmision: string;
  fechaVencimiento: string;
  items: ItemFactura[];
  descuentos?: number;
  observaciones?: string;
}

export interface PagarFacturaRequest {
  fechaPago: string;
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'TARJETA';
  referencia?: string;
}

export interface FacturasResponse {
  content: Factura[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface CalcularTotalResponse {
  facturaId: number;
  subtotal: number;
  impuestos: number;
  descuentos: number;
  total: number;
}

/**
 * Servicio para gestionar Facturas del Componente B
 */
export class FacturasService {
  /**
   * Listar facturas con filtros opcionales
   */
  static async listarFacturas(
    page: number = 0,
    size: number = 10,
    proveedorId?: number,
    estado?: string,
    fechaInicio?: string,
    fechaFin?: string
  ): Promise<FacturasResponse> {
    let url = `/facturas?page=${page}&size=${size}`;
    if (proveedorId) url += `&proveedorId=${proveedorId}`;
    if (estado) url += `&estado=${estado}`;
    if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
    if (fechaFin) url += `&fechaFin=${fechaFin}`;

    return ApiClient.getFromComponenteB<FacturasResponse>(url);
  }

  /**
   * Obtener una factura por ID
   */
  static async obtenerFactura(id: number): Promise<Factura> {
    return ApiClient.getFromComponenteB<Factura>(`/facturas/${id}`);
  }

  /**
   * Crear una nueva factura
   */
  static async crearFactura(factura: FacturaInput): Promise<Factura> {
    return ApiClient.postToComponenteB<Factura>('/facturas', factura);
  }

  /**
   * Actualizar una factura
   */
  static async actualizarFactura(
    id: number,
    factura: FacturaInput
  ): Promise<Factura> {
    return ApiClient.putToComponenteB<Factura>(`/facturas/${id}`, factura);
  }

  /**
   * Calcular total de una factura
   */
  static async calcularTotal(id: number): Promise<CalcularTotalResponse> {
    return ApiClient.getFromComponenteB<CalcularTotalResponse>(
      `/facturas/${id}/calcular-total`
    );
  }

  /**
   * Registrar pago de una factura
   */
  static async pagarFactura(
    id: number,
    pago: PagarFacturaRequest
  ): Promise<Factura> {
    return ApiClient.postToComponenteB<Factura>(`/facturas/${id}/pagar`, pago);
  }

  /**
   * INTEGRACIÓN CIRCULAR: Consultar pedido del Componente A
   */
  static async consultarPedidoComponenteA(pedidoId: number): Promise<any> {
    return ApiClient.getFromComponenteB(
      `/facturas/consultar-pedido/${pedidoId}`
    );
  }
}