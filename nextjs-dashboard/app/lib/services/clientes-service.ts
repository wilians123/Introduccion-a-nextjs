import { ApiClient } from './api-client';

// Tipos para Cliente
export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  codigoUnico: string;
}

export interface ClienteInput {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface ClientesResponse {
  content: Cliente[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Servicio para gestionar Clientes del Componente A
 */
export class ClientesService {
  /**
   * Listar clientes con paginación
   */
  static async listarClientes(
    page: number = 0,
    size: number = 10
  ): Promise<ClientesResponse> {
    return ApiClient.getFromComponenteA<ClientesResponse>(
      `/clientes?page=${page}&size=${size}`
    );
  }

  /**
   * Obtener un cliente por ID
   */
  static async obtenerCliente(id: number): Promise<Cliente> {
    return ApiClient.getFromComponenteA<Cliente>(`/clientes/${id}`);
  }

  /**
   * Crear un nuevo cliente
   */
  static async crearCliente(cliente: ClienteInput): Promise<Cliente> {
    return ApiClient.postToComponenteA<Cliente>('/clientes', cliente);
  }

  /**
   * Actualizar un cliente
   */
  static async actualizarCliente(
    id: number,
    cliente: ClienteInput
  ): Promise<Cliente> {
    return ApiClient.putToComponenteA<Cliente>(`/clientes/${id}`, cliente);
  }

  /**
   * Eliminar un cliente
   */
  static async eliminarCliente(id: number): Promise<void> {
    return ApiClient.deleteFromComponenteA(`/clientes/${id}`);
  }
}