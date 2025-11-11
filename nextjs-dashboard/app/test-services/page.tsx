'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestServicesPage() {
  const [resultado, setResultado] = useState<string>('');
  const [cargando, setCargando] = useState(false);

  const probarServicio = async (nombre: string, fn: () => Promise<any>) => {
    setCargando(true);
    setResultado(`🔄 Probando ${nombre}...`);
    try {
      const data = await fn();
      setResultado(
        `✅ ${nombre} exitoso:\n\n${JSON.stringify(data, null, 2)}`
      );
    } catch (error: any) {
      setResultado(`❌ Error en ${nombre}:\n\n${error.message || error.toString()}`);
      console.error('Error completo:', error);
    } finally {
      setCargando(false);
    }
  };

  // Funciones de prueba
  const probarClientes = async () => {
    const response = await fetch('http://localhost:8080/api/v1/clientes?page=0&size=5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarClientePorId = async () => {
    const response = await fetch('http://localhost:8080/api/v1/clientes/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarPedidos = async () => {
    const response = await fetch('http://localhost:8080/api/v1/pedidos?page=0&size=5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarPedidoPorId = async () => {
    const response = await fetch('http://localhost:8080/api/v1/pedidos/2', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarProveedores = async () => {
    const response = await fetch('http://localhost:8081/api/v1/proveedores?page=0&size=5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarProveedorPorId = async () => {
    const response = await fetch('http://localhost:8081/api/v1/proveedores/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarFacturas = async () => {
    const response = await fetch('http://localhost:8081/api/v1/facturas?page=0&size=5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarFacturaPorId = async () => {
    const response = await fetch('http://localhost:8081/api/v1/facturas/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const probarIntegracionCircular = async () => {
    const response = await fetch('http://localhost:8081/api/v1/facturas/consultar-pedido/2', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const text = await response.text();
    return JSON.parse(text);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Prueba de Servicios Backend
          </h1>
          <p className="text-gray-600 mt-2">
            Prueba la conectividad con los microservicios de Java (Spring Boot)
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Componente A */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mr-3">
                A
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Componente A
                </h2>
                <p className="text-sm text-gray-600">Puerto 8080 - MariaDB</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => probarServicio('Listar Clientes', probarClientes)}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Listar Clientes
              </button>

              <button
                onClick={() => probarServicio('Obtener Cliente #1', probarClientePorId)}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Obtener Cliente #1
              </button>

              <button
                onClick={() => probarServicio('Listar Pedidos', probarPedidos)}
                className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Listar Pedidos
              </button>

              <button
                onClick={() => probarServicio('Obtener Pedido #2', probarPedidoPorId)}
                className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Obtener Pedido #2
              </button>
            </div>
          </div>

          {/* Componente B */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mr-3">
                B
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Componente B
                </h2>
                <p className="text-sm text-gray-600">Puerto 8081 - PostgreSQL</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => probarServicio('Listar Proveedores', probarProveedores)}
                className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Listar Proveedores
              </button>

              <button
                onClick={() => probarServicio('Obtener Proveedor #1', probarProveedorPorId)}
                className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Obtener Proveedor #1
              </button>

              <button
                onClick={() => probarServicio('Listar Facturas', probarFacturas)}
                className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Listar Facturas
              </button>

              <button
                onClick={() => probarServicio('Obtener Factura #1', probarFacturaPorId)}
                className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Obtener Factura #1
              </button>

              <button
                onClick={() => probarServicio('Integración Circular (B→A)', probarIntegracionCircular)}
                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold"
                disabled={cargando}
              >
                <span className="mr-2"></span>
                Probar Integración Circular
              </button>
            </div>
          </div>
        </div>

        {/* Área de Resultados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultado de la Prueba
            </h3>
            {cargando && (
              <div className="flex items-center text-blue-600">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 font-mono">
              {resultado || ' Haz clic en un boton para probar la conectividad con los servicios...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}