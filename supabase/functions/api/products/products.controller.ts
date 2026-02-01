import { Hono } from "@hono/hono";
import { zValidator } from "@hono/zod-validator";
import { formatZodError } from "../utils/formatZodError.ts";
import { authMiddleware } from "../common/middleware/auth.ts";
import { UserData } from "../common/middleware/types.ts";
import { CreateProductSchema } from "./schemas/createProduct.schema.ts";
import * as ProductsService from "./products.service.ts";
import { GetProductsQuerySchema } from "./schemas/getProductsParams.schema.ts";
import z from "zod";
import { UpdateProductSchema } from "./schemas/updateProduct.schema.ts";

const products = new Hono<{ Variables: { user: UserData } }>();

products.use("*", authMiddleware);

products.post(
  "/",
  zValidator("json", CreateProductSchema, formatZodError),
  async (c) => {
    const data = c.req.valid("json");
    const authUser = c.get("user");
    const product = await ProductsService.createProduct(authUser, data);
    return c.json(product);
  },
);

products.get(
  "/",
  zValidator("query", GetProductsQuerySchema, formatZodError),
  async (c) => {
    const filters = c.req.valid("query");
    const authUser = c.get("user");
    const products = await ProductsService.getProductsPaginated(
      authUser,
      filters,
    );
    return c.json(products);
  },
);

products.get(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() }), formatZodError),
  async (c) => {
    const { id: productId } = c.req.valid("param");
    const authUser = c.get("user");
    const product = await ProductsService.getProductById(authUser, productId);
    return c.json(product);
  },
);

products.patch(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() }), formatZodError),
  zValidator("json", UpdateProductSchema, formatZodError),
  async (c) => {
    const { id: productId } = c.req.valid("param");
    const data = c.req.valid("json");
    const authUser = c.get("user");
    const product = await ProductsService.updateProduct(
      authUser,
      productId,
      data,
    );
    return c.json(product);
  },
);

products.delete(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() }), formatZodError),
  async (c) => {
    const { id: productId } = c.req.valid("param");
    const authUser = c.get("user");
    await ProductsService.deleteProduct(authUser, productId);
    return c.body(null, 204);
  },
);

export default products;
