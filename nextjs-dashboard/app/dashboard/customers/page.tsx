'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  codigoUnico: string;
}

export default function CustomersPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/clientes?page=0&size=100');
      if (!response.ok) throw new Error('Error al cargar clientes');
      const data = await response.json();
      setClientes(data.content || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Clientes</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando clientes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Clientes</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchClientes}
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
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Clientes</h1>
      <Search placeholder="Buscar clientes..." />
      
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Vista móvil */}
              <div className="md:hidden">
                {clientes.map((cliente) => (
                  <div key={cliente.id} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                              {cliente.nombre.charAt(0)}
                            </div>
                            <p className="font-semibold">{cliente.nombre}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{cliente.email}</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-gray-500">Código: {cliente.codigoUnico}</p>
                      {cliente.telefono && (
                        <p className="text-xs text-gray-500">Tel: {cliente.telefono}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista desktop */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nombre</th>
                    <th scope="col" className="px-3 py-5 font-medium">Email</th>
                    <th scope="col" className="px-3 py-5 font-medium">Teléfono</th>
                    <th scope="col" className="px-3 py-5 font-medium">Código</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="group bg-white">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            {cliente.nombre.charAt(0)}
                          </div>
                          <p className="font-medium">{cliente.nombre}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {cliente.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {cliente.telefono || '-'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm text-gray-500">
                        {cliente.codigoUnico}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}