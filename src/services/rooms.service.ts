import { InternalError } from '../errors/internal.error';
import { Room, RoomModel } from '../models/rooms.model';
import {
  CreateRoomInput,
  ListRoomsInput,
  UpdateRoomInput,
} from '../types/rooms.types';
import { MetadataArray } from '../types/types';
import { KnexService } from './knex.service';

export const findRoomById = async (id: number): Promise<Room> => {
  const knex = KnexService.getInstance().knex;

  const query = knex({ r: 'rooms' })
    .innerJoin({ h: 'hours' }, 'r.id', 'h.room_id')
    .select('r.*', knex.raw('json_agg(h) as hours'))
    .where('r.id', id)
    .whereNull('r.deleted_at')
    .whereNull('h.deleted_at')
    .groupBy('r.id')
    .first();

  return query
    .then((room: RoomModel) => {
      if (!room) {
        throw new InternalError(201);
      }

      const { updated_at, deleted_at, ...rest } = room;

      return { ...rest };
    })
    .catch((e) => {
      if (e instanceof InternalError) {
        throw e;
      }

      throw new InternalError(203, [e.message]);
    });
};

export const listRooms = async (
  input: ListRoomsInput,
): Promise<MetadataArray<Room>> => {
  const knex = KnexService.getInstance().knex;

  const { filter, pagination } = input;

  const countQuery = knex({ r: 'rooms' })
    .count({ total: 'r.id' })
    .whereNull('r.deleted_at');

  KnexService.appendFiltersToQuery(countQuery, filter);

  console.log('countQuery', countQuery.toString());

  return countQuery
    .then(async ([count]) => {
      const query = countQuery
        .clone()
        .clearSelect()
        .innerJoin({ h: 'hours' }, 'r.id', 'h.room_id')
        .select('r.*', knex.raw('json_agg(h) as hours'))
        .groupBy('r.id');

      KnexService.addPaginationToQuery(query, pagination);
      query.orderBy('r.id', 'desc');

      console.log('query', query.toString());

      const data: RoomModel[] = (await query) as RoomModel[];

      const rooms = data.map(
        ({ updated_at: _, deleted_at: __, ...rest }) => rest,
      );

      return {
        metadata: {
          total: Number(count.total!),
          page: pagination?.page,
          limit: pagination?.limit,
        },
        data: rooms,
      };
    })
    .catch((e) => {
      throw new InternalError(206, [e.message]);
    });
};

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

export const deleteRoom = async (id: number): Promise<void> => {
  const knex = KnexService.getInstance().knex;

  const deleteQuery = knex('rooms')
    .update({
      deleted_at: knex.fn.now(),
    })
    .where('id', id)
    .whereNull('deleted_at');

  return deleteQuery
    .then(() => {
      return;
    })
    .catch((e) => {
      if (e instanceof InternalError) {
        throw e;
      }
      throw new InternalError(204, [e.message]);
    });
};

export const createRoom = async (input: CreateRoomInput): Promise<void> => {
  const knex = KnexService.getInstance().knex;
  const { name, informations, opening_hour, closing_hour } = input;

  await Promise.resolve(
    knex('rooms').insert({
      name: name,
      informations: informations,
      opening_hour: opening_hour,
      closing_hour: closing_hour,
    }),
  ).catch((error) => {
    throw new InternalError(102, error.message);
  });
};
