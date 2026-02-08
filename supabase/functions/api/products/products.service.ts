import * as ProductsRepository from "./products.repository.ts";
import * as TeamsRepository from "../teams/teams.repository.ts";
import { UserData } from "../common/middleware/types.ts";
import { CreateProduct } from "./schemas/createProduct.schema.ts";
import { HttpError } from "shared/errors/http.error.ts";
import {
  GetProductsQuery,
  PaginationCursor,
} from "./schemas/getProductsParams.schema.ts";
import { encodeBase64String } from "../utils/encodeBase64String.ts";
import { ProductStatus } from "shared/db/types.ts";
import { UpdateProduct } from "./schemas/updateProduct.schema.ts";

export const createProduct = (
  { db, payload }: UserData,
  data: CreateProduct,
) => {
  const { sub: authUser } = payload;
  const { teamId } = data;

  return db.transaction().execute(async (trx) => {
    const team = await TeamsRepository.findById(trx, teamId, {
      omitUsers: true,
    });
    if (!team) {
      throw new HttpError(404, `Team with id: ${teamId} does not exist`);
    }
    return ProductsRepository.create(trx, {
      ...data,
      createdBy: authUser,
    });
  });
};

export const getProductById = async ({ db }: UserData, id: string) => {
  const product = await ProductsRepository.findById(db, id);
  if (!product)
    throw new HttpError(404, `Product with id: ${id} does not exist`);
  return product;
};

export const getProductsPaginated = async (
  { db }: UserData,
  filters: GetProductsQuery,
) => {
  const { limit } = filters;
  const products = await ProductsRepository.getPaginated(db, {
    ...filters,
    limit: limit + 1,
  });
  let cursor = null;
  if (limit + 1 === products.length) {
    const { createdAt, id } = products.pop()!;
    cursor = encodeCursor({ createdAt, id });
  }
  return {
    products,
    cursor,
  };
};

export const updateProduct = async (
  { db }: UserData,
  id: string,
  data: UpdateProduct,
) => {
  const existingProduct = await ProductsRepository.findById(db, id);
  if (!existingProduct) {
    throw new HttpError(404, `Product with id: ${id} does not exist`);
  }
  if (existingProduct.status !== ProductStatus.DRAFT) {
    throw new HttpError(
      400,
      `Product status can only be changed from Draft to Active`,
    );
  }
  return ProductsRepository.updateById(db, id, data);
};

export const deleteProduct = async ({ db }: UserData, id: string) => {
  const product = await ProductsRepository.findById(db, id);
  if (!product)
    throw new HttpError(404, `Product with id: ${id} does not exist`);
  await ProductsRepository.deleteById(db, id);
};

const encodeCursor = (cursor: PaginationCursor) =>
  encodeBase64String(JSON.stringify(cursor));
