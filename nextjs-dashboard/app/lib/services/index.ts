/**
 * Exportaciones centralizadas de todos los servicios
 */

export { ApiClient } from './api-client';

// Componente A - Clientes y Pedidos
export { ClientesService } from './clientes-service';
export { PedidosService } from './pedidos-service';

// Componente B - Proveedores y Facturas
export { ProveedoresService } from './proveedores-service';
export { FacturasService } from './facturas-service';

// Tipos de Componente A
export type {
  Cliente,
  ClienteInput,
  ClientesResponse,
} from './clientes-service';

export type {
  Pedido,
  PedidoInput,
  PedidosResponse,
  ItemPedido,
} from './pedidos-service';

// Tipos de Componente B
export type {
  Proveedor,
  ProveedorInput,
  ProveedoresResponse,
} from './proveedores-service';

export type {
  Factura,
  FacturaInput,
  FacturasResponse,
  ItemFactura,
  PagarFacturaRequest,
  CalcularTotalResponse,
} from './facturas-service';