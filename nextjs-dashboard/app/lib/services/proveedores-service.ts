import { ApiClient } from './api-client';

// Tipos para Proveedor
export interface Proveedor {
  id: number;
  razonSocial: string;
  rfc: string;
  email: string;
  telefono?: string;
  direccion?: string;
  contactoNombre?: string;
  codigoUnico: string;
  categoriaProductos?: string;
  fechaRegistro?: string;
  activo: boolean;
}

export interface ProveedorInput {
  razonSocial: string;
  rfc: string;
  email: string;
  telefono?: string;
  direccion?: string;
  contactoNombre?: string;
  categoriaProductos?: string;
}

export interface ProveedoresResponse {
  content: Proveedor[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Servicio para gestionar Proveedores del Componente B
 */
export class ProveedoresService {
  /**
   * Listar proveedores con paginación
   */
  static async listarProveedores(
    page: number = 0,
    size: number = 10,
    activo?: boolean
  ): Promise<ProveedoresResponse> {
    let url = `/proveedores?page=${page}&size=${size}`;
    if (activo !== undefined) {
      url += `&activo=${activo}`;
    }
    return ApiClient.getFromComponenteB<ProveedoresResponse>(url);
  }

  /**
   * Obtener un proveedor por ID
   */
  static async obtenerProveedor(id: number): Promise<Proveedor> {
    return ApiClient.getFromComponenteB<Proveedor>(`/proveedores/${id}`);
  }

  /**
   * Crear un nuevo proveedor
   */
  static async crearProveedor(proveedor: ProveedorInput): Promise<Proveedor> {
    return ApiClient.postToComponenteB<Proveedor>('/proveedores', proveedor);
  }

  /**
   * Actualizar un proveedor
   */
  static async actualizarProveedor(
    id: number,
    proveedor: ProveedorInput
  ): Promise<Proveedor> {
    return ApiClient.putToComponenteB<Proveedor>(
      `/proveedores/${id}`,
      proveedor
    );
  }

  /**
   * Eliminar un proveedor (soft delete)
   */
  static async eliminarProveedor(id: number): Promise<void> {
    return ApiClient.deleteFromComponenteB(`/proveedores/${id}`);
  }
}