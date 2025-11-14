'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';

interface Proveedor {
  id: number;
  razonSocial: string;
  email: string;
  telefono?: string;
  rfc: string;
  direccion?: string;
  codigoUnico: string;
  categoriaProductos?: string;
  activo: boolean;
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/proveedores?page=0&size=100');
      
      if (!response.ok) throw new Error('Error al cargar proveedores');
      
      const data = await response.json();
      setProveedores(data.content || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Proveedores</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando proveedores...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Proveedores</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <p className="text-sm text-red-600 mt-2">
            Asegúrate de que el Componente B esté corriendo en http://localhost:8081
          </p>
          <button
            onClick={fetchProveedores}
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
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Proveedores</h1>
      <Search placeholder="Buscar proveedores..." />
      
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Vista móvil */}
              <div className="md:hidden">
                {proveedores.map((proveedor) => (
                  <div key={proveedor.id} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                              {proveedor.razonSocial.charAt(0)}
                            </div>
                            <p className="font-semibold">{proveedor.razonSocial}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{proveedor.email}</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-gray-500">RFC: {proveedor.rfc}</p>
                      <p className="text-xs text-gray-500">Código: {proveedor.codigoUnico}</p>
                      {proveedor.telefono && (
                        <p className="text-xs text-gray-500">Tel: {proveedor.telefono}</p>
                      )}
                      {proveedor.categoriaProductos && (
                        <p className="text-xs text-gray-500">Categoría: {proveedor.categoriaProductos}</p>
                      )}
                      <p className={`text-xs mt-2 ${proveedor.activo ? 'text-green-600' : 'text-red-600'}`}>
                        {proveedor.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista desktop */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Razón Social</th>
                    <th scope="col" className="px-3 py-5 font-medium">Email</th>
                    <th scope="col" className="px-3 py-5 font-medium">RFC</th>
                    <th scope="col" className="px-3 py-5 font-medium">Teléfono</th>
                    <th scope="col" className="px-3 py-5 font-medium">Categoría</th>
                    <th scope="col" className="px-3 py-5 font-medium">Código</th>
                    <th scope="col" className="px-3 py-5 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {proveedores.map((proveedor) => (
                    <tr key={proveedor.id} className="group bg-white">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                            {proveedor.razonSocial.charAt(0)}
                          </div>
                          <p className="font-medium">{proveedor.razonSocial}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {proveedor.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {proveedor.rfc}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {proveedor.telefono || '-'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {proveedor.categoriaProductos || '-'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm text-gray-500">
                        {proveedor.codigoUnico}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          proveedor.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {proveedor.activo ? 'Activo' : 'Inactivo'}
                        </span>
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