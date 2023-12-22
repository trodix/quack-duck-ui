export interface PaginationResult<T> {
  offset: number,
  pageSize: number,
  total: number,
  entries: T
}
