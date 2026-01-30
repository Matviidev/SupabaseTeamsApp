import { CreateTeam } from "./schemas/createTeam.schema.ts";
import * as TeamsRepository from "./teams.repository.ts";
import * as UsersRepository from "../users/users.repository.ts";
import { UserData } from "../common/middleware/types.ts";
import { HttpError } from "../utils/errors/http.error.ts";

export const createTeam = ({ db, payload }: UserData, data: CreateTeam) => {
  const { sub: userId } = payload;
  return db.transaction().execute(async (trx) => {
    const newTeam = await TeamsRepository.create(trx, data);
    console.log({ newTeam });
    await UsersRepository.updateById(trx, userId, {
      teamId: newTeam.id,
    });
    return newTeam;
  });
};

export const joinTeam = ({ db, payload }: UserData, code: string) => {
  const { sub: userId } = payload;
  return db.transaction().execute(async (trx) => {
    const user = await UsersRepository.findById(trx, userId);
    if (user.teamId) {
      throw new HttpError(400, "You are already in a team.");
    }
    const team = await TeamsRepository.findByInviteCode(trx, code);
    if (!team) {
      throw new HttpError(400, "Invite code is invalid");
    }
    const updatedUser = await UsersRepository.updateById(trx, userId, {
      teamId: team.id,
    });
    return updatedUser;
  });
};

export const leaveTeam = async ({ db, payload }: UserData) => {
  const { sub: userId } = payload;
  const user = await UsersRepository.updateById(db, userId, {
    teamId: null,
  });
  return user;
};

export const getTeamById = async ({ db }: UserData, id: string) => {
  const team = await TeamsRepository.findById(db, id);
  if (!team) throw new HttpError(404, `Team with id: ${id} not found`);
  return team;
};
