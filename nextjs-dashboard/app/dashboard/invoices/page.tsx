'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ItemFactura {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Factura {
  id: number;
  proveedorId: number;
  numeroFactura: string;
  codigoFactura: string;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: string;
  items: ItemFactura[];
  subtotal: number;
  impuestos: number;
  descuentos: number;
  total: number;
}

export default function InvoicesPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/v1/facturas?page=0&size=100');
      if (!response.ok) throw new Error('Error al cargar facturas');
      const data = await response.json();
      setFacturas(data.content || []);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (estado: string) => {
    const styles = {
      EMITIDA: 'bg-gray-100 text-gray-800',
      PAGADA: 'bg-green-100 text-green-800',
      VENCIDA: 'bg-red-100 text-red-800',
      CANCELADA: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styles[estado as keyof typeof styles] || styles.EMITIDA}`}>
        {estado}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Facturas</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando facturas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Facturas</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <p className="text-sm text-red-600 mt-2">
            Asegúrate de que el Componente B esté corriendo en http://localhost:8081
          </p>
          <button 
            onClick={fetchFacturas}
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
        <h1 className={`${lusitana.className} text-2xl`}>Facturas</h1>
      </div>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar facturas..." />
        <Link
          href="/dashboard/invoices/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Crear Factura</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {/* Vista móvil */}
            <div className="md:hidden">
              {facturas.map((factura) => (
                <div key={factura.id} className="mb-2 w-full rounded-md bg-white p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2">
                        <p className="font-semibold">{factura.numeroFactura}</p>
                        <p className="text-xs text-gray-500">{factura.codigoFactura}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Proveedor ID: {factura.proveedorId}
                      </p>
                    </div>
                    {getStatusBadge(factura.estado)}
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{formatCurrency(factura.total)}</p>
                      <p className="text-sm text-gray-500">
                        Vence: {formatDate(factura.fechaVencimiento)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista desktop */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Número</th>
                  <th scope="col" className="px-3 py-5 font-medium">Código</th>
                  <th scope="col" className="px-3 py-5 font-medium">Proveedor</th>
                  <th scope="col" className="px-3 py-5 font-medium">Emisión</th>
                  <th scope="col" className="px-3 py-5 font-medium">Total</th>
                  <th scope="col" className="px-3 py-5 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {facturas.map((factura) => (
                  <tr
                    key={factura.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <p className="font-medium">{factura.numeroFactura}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                      {factura.codigoFactura}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      Proveedor #{factura.proveedorId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDate(factura.fechaEmision)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className="font-semibold">{formatCurrency(factura.total)}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {getStatusBadge(factura.estado)}
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