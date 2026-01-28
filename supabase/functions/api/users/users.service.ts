import * as UserRepository from "./users.repository.ts";
import { UserData } from "../common/middleware/types.ts";

export const findUserById = ({ db }: UserData, id: string) => {
  return UserRepository.findById(db, id);
};

export const findAllUsers = ({ db }: UserData) => {
  return UserRepository.findAll(db);
};

export const findMe = ({ db, payload }: UserData) => {
  const { sub: userId } = payload;
  return UserRepository.findById(db, userId);
};
