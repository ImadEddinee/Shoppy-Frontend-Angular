export interface Product {

  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;

}
