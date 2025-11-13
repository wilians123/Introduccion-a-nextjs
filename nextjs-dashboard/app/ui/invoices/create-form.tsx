"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { useRouter } from "next/navigation";

// Tipos para el formulario
interface Proveedor {
  id: number;
  razonSocial: string;
  rfc: string;
  email: string;
  activo: boolean;
}

interface ItemFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

export default function CreateInvoiceForm() {
  const router = useRouter();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    proveedorId: "",
    numeroFactura: "",
    fechaEmision: new Date().toISOString().split('T')[0],
    fechaVencimiento: "",
    items: [{ descripcion: "", cantidad: 1, precioUnitario: 0 }] as ItemFactura[],
    descuentos: 0,
    observaciones: "",
  });

  // Cargar proveedores al montar el componente
  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/proveedores?page=0&size=100&activo=true"
      );
      if (!response.ok) throw new Error("Error al cargar proveedores");
      const data = await response.json();
      setProveedores(data.content || []);
    } catch (error: any) {
      console.error("Error:", error);
      setErrors({ general: "No se pudieron cargar los proveedores" });
    } finally {
      setLoading(false);
    }
  };

  // Agregar nuevo item a la factura
  const agregarItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { descripcion: "", cantidad: 1, precioUnitario: 0 }],
    });
  };

  // Eliminar item
  const eliminarItem = (index: number) => {
    if (formData.items.length > 1) {
      const nuevosItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: nuevosItems });
    }
  };

  // Actualizar item específico
  const actualizarItem = (index: number, campo: keyof ItemFactura, valor: any) => {
    const nuevosItems = [...formData.items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    setFormData({ ...formData, items: nuevosItems });
  };

  // Calcular subtotal
  const calcularSubtotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario,
      0
    );
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores: any = {};

    if (!formData.proveedorId) {
      nuevosErrores.proveedorId = "Debe seleccionar un proveedor";
    }
    if (!formData.numeroFactura.trim()) {
      nuevosErrores.numeroFactura = "El número de factura es requerido";
    }
    if (!formData.fechaVencimiento) {
      nuevosErrores.fechaVencimiento = "La fecha de vencimiento es requerida";
    }

    // Validar items
    formData.items.forEach((item, index) => {
      if (!item.descripcion.trim()) {
        nuevosErrores[`item_${index}_descripcion`] = "La descripción es requerida";
      }
      if (item.cantidad <= 0) {
        nuevosErrores[`item_${index}_cantidad`] = "La cantidad debe ser mayor a 0";
      }
      if (item.precioUnitario <= 0) {
        nuevosErrores[`item_${index}_precio`] = "El precio debe ser mayor a 0";
      }
    });

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const facturaInput = {
        proveedorId: parseInt(formData.proveedorId),
        numeroFactura: formData.numeroFactura,
        fechaEmision: formData.fechaEmision,
        fechaVencimiento: formData.fechaVencimiento,
        items: formData.items,
        descuentos: formData.descuentos,
        observaciones: formData.observaciones || null,
      };

      const response = await fetch("http://localhost:8081/api/v1/facturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facturaInput),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la factura");
      }

      // Redirigir a la lista de facturas
      router.push("/dashboard/invoices");
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando proveedores...</p>
      </div>
    );
  }

  const subtotal = calcularSubtotal();

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Error general */}
        {errors.general && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        {/* Proveedor */}
        <div className="mb-4">
          <label htmlFor="proveedor" className="mb-2 block text-sm font-medium">
            Seleccionar Proveedor
          </label>
          <div className="relative">
            <select
              id="proveedor"
              value={formData.proveedorId}
              onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.razonSocial} - {proveedor.rfc}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.proveedorId && (
            <p className="mt-2 text-sm text-red-500">{errors.proveedorId}</p>
          )}
        </div>

        {/* Número de Factura */}
        <div className="mb-4">
          <label htmlFor="numeroFactura" className="mb-2 block text-sm font-medium">
            Número de Factura
          </label>
          <input
            id="numeroFactura"
            type="text"
            value={formData.numeroFactura}
            onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
            placeholder="FAC-2025-0001"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
          {errors.numeroFactura && (
            <p className="mt-2 text-sm text-red-500">{errors.numeroFactura}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fechaEmision" className="mb-2 block text-sm font-medium">
              Fecha de Emisión
            </label>
            <input
              id="fechaEmision"
              type="date"
              value={formData.fechaEmision}
              onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            />
          </div>
          <div>
            <label htmlFor="fechaVencimiento" className="mb-2 block text-sm font-medium">
              Fecha de Vencimiento
            </label>
            <input
              id="fechaVencimiento"
              type="date"
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            />
            {errors.fechaVencimiento && (
              <p className="mt-2 text-sm text-red-500">{errors.fechaVencimiento}</p>
            )}
          </div>
        </div>

        {/* Items de la Factura */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">Productos o Servicios</label>
            <button
              type="button"
              onClick={agregarItem}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-4 w-4" />
              Agregar otro producto
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">Producto {index + 1}</span>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarItem(index)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Eliminar
                  </button>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descripción del producto o servicio *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Monitor LED 24 pulgadas"
                  value={item.descripcion}
                  onChange={(e) => actualizarItem(index, "descripcion", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors[`item_${index}_descripcion`] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[`item_${index}_descripcion`]}
                  </p>
                )}
              </div>

              {/* Cantidad, Precio y Subtotal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 5"
                    min="1"
                    value={item.cantidad || ''}
                    onChange={(e) => actualizarItem(index, "cantidad", parseInt(e.target.value) || 0)}
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors[`item_${index}_cantidad`] && (
                    <p className="mt-1 text-xs text-red-500">{errors[`item_${index}_cantidad`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Precio Unitario (Q) *
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 400.00"
                    min="0"
                    step="0.01"
                    value={item.precioUnitario || ''}
                    onChange={(e) =>
                      actualizarItem(index, "precioUnitario", parseFloat(e.target.value) || 0)
                    }
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors[`item_${index}_precio`] && (
                    <p className="mt-1 text-xs text-red-500">{errors[`item_${index}_precio`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Subtotal
                  </label>
                  <div className="flex items-center h-[42px] px-3 rounded-md bg-gray-50 border border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      Q {(item.cantidad * item.precioUnitario).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Descuentos - Simplificado y opcional */}
        <div className="mb-4">
          <label htmlFor="descuentos" className="mb-2 block text-sm font-medium">
            Descuento (opcional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Q</span>
            <input
              id="descuentos"
              type="number"
              min="0"
              step="0.01"
              value={formData.descuentos || ''}
              onChange={(e) => setFormData({ ...formData, descuentos: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm outline-2 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Deja en blanco si no aplica descuento</p>
        </div>

        {/* Resumen */}
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Subtotal:</span>
            <span className="text-sm font-medium">Q {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Descuentos:</span>
            <span className="text-sm font-medium">- Q {formData.descuentos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Impuestos (12%):</span>
            <span className="text-sm font-medium">
              Q {((subtotal - formData.descuentos) * 0.12).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">
              Q {((subtotal - formData.descuentos) * 1.12).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creando..." : "Crear Factura"}
        </Button>
      </div>
    </form>
  );
}