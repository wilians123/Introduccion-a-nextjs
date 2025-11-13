'use client';

import { useState } from 'react';

export default function PruebasPage() {
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
    } finally {
      setCargando(false);
    }
  };

  const probarClientes = async () => {
    const res = await fetch('http://localhost:8080/api/v1/clientes?page=0&size=5');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const probarPedidos = async () => {
    const res = await fetch('http://localhost:8080/api/v1/pedidos?page=0&size=5');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const probarProveedores = async () => {
    const res = await fetch('http://localhost:8081/api/v1/proveedores?page=0&size=5');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const probarFacturas = async () => {
    const res = await fetch('http://localhost:8081/api/v1/facturas?page=0&size=5');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const probarIntegracion = async () => {
    const res = await fetch('http://localhost:8081/api/v1/facturas/consultar-pedido/2');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return JSON.parse(text);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">🧪 Pruebas de Servicios</h1>
      
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="border rounded-lg p-4 bg-blue-50">
          <h2 className="text-lg font-semibold mb-3 text-blue-700">Componente A (8080)</h2>
          <div className="space-y-2">
            <button onClick={() => probarServicio('Listar Clientes', probarClientes)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={cargando}>
              👥 Listar Clientes
            </button>
            <button onClick={() => probarServicio('Listar Pedidos', probarPedidos)}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              disabled={cargando}>
              📋 Listar Pedidos
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-purple-50">
          <h2 className="text-lg font-semibold mb-3 text-purple-700">Componente B (8081)</h2>
          <div className="space-y-2">
            <button onClick={() => probarServicio('Listar Proveedores', probarProveedores)}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
              disabled={cargando}>
              🏢 Listar Proveedores
            </button>
            <button onClick={() => probarServicio('Listar Facturas', probarFacturas)}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              disabled={cargando}>
              📄 Listar Facturas
            </button>
            <button onClick={() => probarServicio('Integración Circular', probarIntegracion)}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={cargando}>
              🔄 Integración Circular
            </button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📊 Resultado:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 bg-white p-4 rounded">
          {resultado || '👆 Haz clic en un botón para probar...'}
        </pre>
      </div>
    </div>
  );
}