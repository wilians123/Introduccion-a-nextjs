/**
 * Cliente HTTP base para consumir los APIs del backend
 * Maneja las peticiones a los Componentes A y B
 */

const API_A = process.env.NEXT_PUBLIC_API_COMPONENTE_A || 'http://localhost:8080/api/v1';
const API_B = process.env.NEXT_PUBLIC_API_COMPONENTE_B || 'http://localhost:8081/api/v1';

export class ApiClient {
  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Métodos para Componente A (Clientes y Pedidos)
  static async getFromComponenteA<T>(endpoint: string): Promise<T> {
    return this.request<T>(`${API_A}${endpoint}`);
  }

  static async postToComponenteA<T>(
    endpoint: string,
    data: unknown
  ): Promise<T> {
    return this.request<T>(`${API_A}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async putToComponenteA<T>(
    endpoint: string,
    data: unknown
  ): Promise<T> {
    return this.request<T>(`${API_A}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteFromComponenteA(endpoint: string): Promise<void> {
    await fetch(`${API_A}${endpoint}`, { method: 'DELETE' });
  }

  // Métodos para Componente B (Proveedores y Facturas)
  static async getFromComponenteB<T>(endpoint: string): Promise<T> {
    return this.request<T>(`${API_B}${endpoint}`);
  }

  static async postToComponenteB<T>(
    endpoint: string,
    data: unknown
  ): Promise<T> {
    return this.request<T>(`${API_B}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async putToComponenteB<T>(
    endpoint: string,
    data: unknown
  ): Promise<T> {
    return this.request<T>(`${API_B}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteFromComponenteB(endpoint: string): Promise<void> {
    await fetch(`${API_B}${endpoint}`, { method: 'DELETE' });
  }
}