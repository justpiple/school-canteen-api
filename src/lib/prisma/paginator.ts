/**
 * Represents the structure of a paginated result.
 *
 * @template T - The type of the data contained in the result.
 */
export interface PaginatedResult<T> {
  data: T[];

  /**
   * Metadata for the pagination.
   */
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

/**
 * Options for pagination.
 */
export type PaginateOptions = {
  /**
   * The page number to retrieve. Can be a number or string.
   * Defaults to `1` if not specified.
   */
  page?: number | string;

  /**
   * The number of items per page. Can be a number or string.
   * Defaults to `10` if not specified.
   */
  perPage?: number | string;
};

/**
 * The type definition for a paginate function.
 *
 * @template T - The type of the data contained in the result.
 * @template K - Additional arguments passed to the query.
 * @param model - The model to query (e.g., database table).
 * @param options - Pagination options, including page number and items per page.
 * @param args - Additional query arguments, such as filters or conditions.
 * @returns A promise that resolves to a `PaginatedResult`.
 */
export type PaginateFunction = <T, K>(
  model: any,
  options?: PaginateOptions,
  args?: K,
) => Promise<PaginatedResult<T>>;

/**
 * Creates a paginator function with default pagination options.
 *
 * @param defaultOptions - Default pagination options, such as page and items per page.
 * @returns A `PaginateFunction` that handles pagination logic.
 *
 * @example
 * const paginate = paginator({ page: 1, perPage: 20 });
 * const result = await paginate(UserModel, { page: 2 }, { where: { isActive: true } });
 * console.log(result.data); // Array of user data for page 2
 * console.log(result.meta); // Metadata about pagination
 */
export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, options, args: any = { where: undefined }) => {
    const page = Number(options?.page ?? defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage ?? defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};
