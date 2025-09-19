export interface AdminPaginatedResponse<Data> {
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
