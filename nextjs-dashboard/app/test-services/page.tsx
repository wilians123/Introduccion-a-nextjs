'use client';

import { useState } from 'react';

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
      setResultado(`❌ Error en ${nombre}:\n\n${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  // Funciones de prueba para cada servicio
  const probarClientes = async () => {
    const response = await fetch('http://localhost:8080/api/v1/clientes?page=0&size=5');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const probarProveedores = async () => {
    const response = await fetch('http://localhost:8081/api/v1/proveedores?page=0&size=5');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const probarPedidos = async () => {
    const response = await fetch('http://localhost:8080/api/v1/pedidos?page=0&size=5');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const probarFacturas = async () => {
    const response = await fetch('http://localhost:8081/api/v1/facturas?page=0&size=5');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const probarIntegracionCircular = async () => {
    // Probar consulta de pedido desde el Componente B
    const response = await fetch('http://localhost:8081/api/v1/facturas/consultar-pedido/2');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        🧪 Prueba de Servicios Backend
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Componente A */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            📦 Componente A (Puerto 8080)
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => probarServicio('Listar Clientes', probarClientes)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={cargando}
            >
              👥 Listar Clientes
            </button>
            
            <button
              onClick={() => probarServicio('Listar Pedidos', probarPedidos)}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={cargando}
            >
              📋 Listar Pedidos
            </button>
          </div>
        </div>

        {/* Componente B */}
        <div className="border rounded-lg p-4 bg-purple-50">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            🏭 Componente B (Puerto 8081)
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => probarServicio('Listar Proveedores', probarProveedores)}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
              disabled={cargando}
            >
              🏢 Listar Proveedores
            </button>
            
            <button
              onClick={() => probarServicio('Listar Facturas', probarFacturas)}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              disabled={cargando}
            >
              📄 Listar Facturas
            </button>
            
            <button
              onClick={() => probarServicio('🔄 Integración Circular', probarIntegracionCircular)}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={cargando}
            >
              🔄 Probar Integración Circular
            </button>
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📊 Resultado:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 bg-white p-4 rounded">
          {resultado || 'Haz clic en un botón para probar un servicio...'}
        </pre>
      </div>
    </div>
  );
}