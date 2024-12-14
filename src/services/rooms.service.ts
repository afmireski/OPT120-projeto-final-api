import { InternalError } from '../errors/internal.error';
import { Room, RoomModel } from '../models/rooms.model';
import { UpdateRoomInput } from '../types/rooms.types';
import { KnexService } from './knex.service';

export const updateRoom = async (
  id: number,
  input: UpdateRoomInput,
): Promise<Room> => {
  const knex = KnexService.getInstance().knex;

  const findQuery = knex({ r: 'rooms' })
    .select('r.*')
    .where('r.id', id)
    .whereNull('r.deleted_at')
    .first();

  const { opening_hour, closing_hour, informations } = input;

  console.log('findQuery', findQuery.toString());

  return findQuery
    .then(async (room: RoomModel) => {
      if (!room) {
        throw new InternalError(201);
      }

      if (opening_hour) {
        if (
          room.closing_hour < opening_hour ||
          (closing_hour && opening_hour >= closing_hour)
        ) {
          throw new InternalError(1, [
            'A hora de abertura não pode ser maior, ou igual, a hora de fechamento',
          ]);
        }
      }
      if (closing_hour) {
        if (
          closing_hour < room.opening_hour ||
          (opening_hour && closing_hour <= opening_hour)
        ) {
          throw new InternalError(1, [
            'A hora de fechamento não pode ser menor, ou igual, a hora de abertura',
          ]);
        }
      }
      if (informations) {
        if (Object.keys(informations).length === 0) {
          throw new InternalError(1, [
            'O campo informações não pode ser vazio',
          ]);
        }
      }

      const updateQuery = knex('rooms')
        .update({
          ...input,
          updated_at: knex.fn.now(),
        })
        .where('id', id)
        .whereNull('deleted_at')
        .returning('*');

      return updateQuery;
    })
    .then((data: Array<RoomModel>) => {
      const { updated_at, deleted_at, ...rest } = data[0];

      return { ...rest };
    })
    .catch((e) => {
      if (e instanceof InternalError) {
        throw e;
      }
      throw new InternalError(204, [e.message]);
    });
};
