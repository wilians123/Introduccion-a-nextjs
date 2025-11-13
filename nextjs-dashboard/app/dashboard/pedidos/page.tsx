'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';

interface ItemPedido {
  id: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Pedido {
  id: number;
  clienteId: number;
  codigoPedido: string;
  items: ItemPedido[];
  subtotal: number;
  impuestos: number;
  total: number;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/pedidos?page=0&size=100');
      if (!response.ok) throw new Error('Error al cargar pedidos');
      const data = await response.json();
      setPedidos(data.content || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Pedidos</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Pedidos</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchPedidos}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Pedidos</h1>
      </div>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar pedidos..." />
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {/* Vista móvil */}
            <div className="md:hidden">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p className="font-semibold">{pedido.codigoPedido}</p>
                      </div>
                      <p className="text-sm text-gray-500">Cliente ID: {pedido.clienteId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-medium">{formatCurrency(pedido.total)}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm">Items: {pedido.items.length}</p>
                    <p className="text-sm text-gray-500">Subtotal: {formatCurrency(pedido.subtotal)}</p>
                    <p className="text-sm text-gray-500">Impuestos: {formatCurrency(pedido.impuestos)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista desktop */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Código</th>
                  <th scope="col" className="px-3 py-5 font-medium">Cliente ID</th>
                  <th scope="col" className="px-3 py-5 font-medium">Items</th>
                  <th scope="col" className="px-3 py-5 font-medium">Subtotal</th>
                  <th scope="col" className="px-3 py-5 font-medium">Impuestos</th>
                  <th scope="col" className="px-3 py-5 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <p className="font-medium">{pedido.codigoPedido}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {pedido.clienteId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {pedido.items.length}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(pedido.subtotal)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(pedido.impuestos)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className="font-semibold">{formatCurrency(pedido.total)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}