export interface PaginatedResponse<Data> {
  data: Data[];
  currentPage: number;
  nextPage: number;
  previousPage: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  totalCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  se_name: string;
  image_url: string;
  product_count: number;
  followers_count: number;
  user: string;
}

export interface Tag {
  id: string;
  name: string;
  seName: string;
}
