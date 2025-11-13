import { Revenue } from './definitions';

// URLs de los componentes backend
const API_A = process.env.NEXT_PUBLIC_API_COMPONENTE_A || 'http://localhost:8080/api/v1';
const API_B = process.env.NEXT_PUBLIC_API_COMPONENTE_B || 'http://localhost:8081/api/v1';

/**
 * Fetch de ingresos mensuales (simulado basado en facturas pagadas)
 */
export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    console.log('Fetching revenue data from local backend...');
    
    // Obtener facturas pagadas del Componente B
    const response = await fetch(`${API_B}/facturas?page=0&size=1000&estado=PAGADA`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch facturas');
    }
    
    const data = await response.json();
    const facturas = data.content || [];
    
    // Agrupar ingresos por mes
    const revenueByMonth: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Inicializar todos los meses en 0
    monthNames.forEach(month => {
      revenueByMonth[month] = 0;
    });
    
    // Sumar totales por mes
    facturas.forEach((factura: any) => {
      if (factura.fechaPago) {
        const fecha = new Date(factura.fechaPago);
        const monthIndex = fecha.getMonth();
        const monthName = monthNames[monthIndex];
        revenueByMonth[monthName] += factura.total || 0;
      }
    });
    
    // Convertir a formato Revenue[]
    const revenue: Revenue[] = monthNames.map(month => ({
      month,
      revenue: Math.round(revenueByMonth[month])
    }));
    
    console.log('Revenue data fetched successfully');
    return revenue;
    
  } catch (error) {
    console.error('Database Error:', error);
    // Retornar datos vacíos en caso de error
    return [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 0 },
      { month: 'Jul', revenue: 0 },
      { month: 'Aug', revenue: 0 },
      { month: 'Sep', revenue: 0 },
      { month: 'Oct', revenue: 0 },
      { month: 'Nov', revenue: 0 },
      { month: 'Dec', revenue: 0 },
    ];
  }
}

/**
 * Fetch de últimas facturas
 */
export async function fetchLatestInvoices() {
  try {
    // Obtener últimas 5 facturas con sus proveedores
    const response = await fetch(`${API_B}/facturas?page=0&size=5`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch facturas');
    }
    
    const data = await response.json();
    const facturas = data.content || [];
    
    // Obtener información de proveedores
    const facturasConProveedor = await Promise.all(
      facturas.map(async (factura: any) => {
        try {
          const provResponse = await fetch(`${API_B}/proveedores/${factura.proveedorId}`);
          const proveedor = provResponse.ok ? await provResponse.json() : null;
          
          return {
            id: factura.id.toString(),
            name: proveedor?.razonSocial || `Proveedor ${factura.proveedorId}`,
            image_url: '/customers/default-avatar.png', // Imagen por defecto
            email: proveedor?.email || 'N/A',
            amount: `Q ${factura.total.toFixed(2)}`
          };
        } catch (error) {
          return {
            id: factura.id.toString(),
            name: `Proveedor ${factura.proveedorId}`,
            image_url: '/customers/default-avatar.png',
            email: 'N/A',
            amount: `Q ${factura.total.toFixed(2)}`
          };
        }
      })
    );
    
    return facturasConProveedor;
    
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

/**
 * Fetch de datos para las tarjetas del dashboard
 */
export async function fetchCardData() {
  try {
    // Obtener facturas del Componente B
    const facturasResponse = await fetch(`${API_B}/facturas?page=0&size=1000`, {
      cache: 'no-store'
    });
    const facturasData = await facturasResponse.json();
    const facturas = facturasData.content || [];
    
    // Obtener clientes del Componente A
    const clientesResponse = await fetch(`${API_A}/clientes?page=0&size=1000`, {
      cache: 'no-store'
    });
    const clientesData = await clientesResponse.json();
    const clientes = clientesData.content || [];
    
    // Calcular totales
    const numberOfInvoices = facturas.length;
    const numberOfCustomers = clientes.length;
    
    // Calcular facturas pagadas y pendientes
    let totalPaid = 0;
    let totalPending = 0;
    
    facturas.forEach((factura: any) => {
      if (factura.estado === 'PAGADA') {
        totalPaid += factura.total || 0;
      } else if (factura.estado === 'EMITIDA' || factura.estado === 'VENCIDA') {
        totalPending += factura.total || 0;
      }
    });
    
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: `Q ${totalPaid.toFixed(2)}`,
      totalPendingInvoices: `Q ${totalPending.toFixed(2)}`,
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    return {
      numberOfCustomers: 0,
      numberOfInvoices: 0,
      totalPaidInvoices: 'Q 0.00',
      totalPendingInvoices: 'Q 0.00',
    };
  }
}

/**
 * Fetch de facturas filtradas (para la tabla)
 */
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const itemsPerPage = 6;
  
  try {
    // Obtener todas las facturas
    const response = await fetch(
      `${API_B}/facturas?page=${currentPage - 1}&size=${itemsPerPage}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch facturas');
    }
    
    const data = await response.json();
    const facturas = data.content || [];
    
    // Enriquecer con datos del proveedor
    const facturasConProveedor = await Promise.all(
      facturas.map(async (factura: any) => {
        try {
          const provResponse = await fetch(`${API_B}/proveedores/${factura.proveedorId}`);
          const proveedor = provResponse.ok ? await provResponse.json() : null;
          
          return {
            id: factura.id.toString(),
            customer_id: factura.proveedorId.toString(),
            amount: Math.round(factura.total * 100), // Convertir a centavos
            date: factura.fechaEmision,
            status: factura.estado === 'PAGADA' ? 'paid' : 'pending',
            name: proveedor?.razonSocial || `Proveedor ${factura.proveedorId}`,
            email: proveedor?.email || 'N/A',
            image_url: '/customers/default-avatar.png'
          };
        } catch (error) {
          return {
            id: factura.id.toString(),
            customer_id: factura.proveedorId.toString(),
            amount: Math.round(factura.total * 100),
            date: factura.fechaEmision,
            status: factura.estado === 'PAGADA' ? 'paid' : 'pending',
            name: `Proveedor ${factura.proveedorId}`,
            email: 'N/A',
            image_url: '/customers/default-avatar.png'
          };
        }
      })
    );
    
    return facturasConProveedor;
    
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

/**
 * Calcular total de páginas
 */
export async function fetchInvoicesPages(query: string) {
  const itemsPerPage = 6;
  
  try {
    const response = await fetch(`${API_B}/facturas?page=0&size=1`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch facturas count');
    }
    
    const data = await response.json();
    const totalCount = data.totalElements || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    
    return totalPages;
    
  } catch (error) {
    console.error('Database Error:', error);
    return 0;
  }
}

/**
 * Fetch de factura por ID
 */
export async function fetchInvoiceById(id: string) {
  try {
    const response = await fetch(`${API_B}/facturas/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch factura');
    }
    
    const factura = await response.json();
    
    return {
      id: factura.id.toString(),
      customer_id: factura.proveedorId.toString(),
      amount: factura.total,
      status: factura.estado === 'PAGADA' ? 'paid' : 'pending'
    };
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

/**
 * Fetch de proveedores (equivalente a customers)
 */
export async function fetchCustomers() {
  try {
    const response = await fetch(`${API_B}/proveedores?page=0&size=100&activo=true`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch proveedores');
    }
    
    const data = await response.json();
    const proveedores = data.content || [];
    
    return proveedores.map((proveedor: any) => ({
      id: proveedor.id.toString(),
      name: proveedor.razonSocial
    }));
    
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

/**
 * Fetch de clientes filtrados (para la tabla de clientes)
 */
export async function fetchFilteredCustomers(query: string) {
  try {
    const response = await fetch(`${API_A}/clientes?page=0&size=100`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch clientes');
    }
    
    const data = await response.json();
    const clientes = data.content || [];
    
    // Formatear según el tipo CustomersTableType
    return clientes.map((cliente: any) => ({
      id: cliente.id.toString(),
      name: cliente.nombre,
      email: cliente.email,
      image_url: '/customers/default-avatar.png',
      total_invoices: 0, // Podrías calcular esto si tienes la relación
      total_pending: 'Q 0.00',
      total_paid: 'Q 0.00'
    }));
    
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}