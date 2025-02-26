import { KnexService } from './knex.service';
import { InternalError } from '../errors/internal.error';

export interface Locked {
  day: Date;
  room_id: number;
}

export const createLocked = async (input: Locked): Promise<void> => {
    const knex = KnexService.getInstance().knex;
    return knex('locked')
      .insert(input)
      .then(() => {})  // descarta o valor retornado, retornando void
      .catch((error) => {
        throw new InternalError(101, [error.message]);
      });
  };
  

export const deleteLocked = async (room_id: number, day: Date): Promise<void> => {
    const knex = KnexService.getInstance().knex;
    return knex('locked')
      .where({ room_id, day })
      .del()
      .then(() => { /* ignora o número retornado e retorna void */ })
      .catch((error) => {
        throw new InternalError(102, [error.message]);
      });
  };  

export const listLocked = async (): Promise<Locked[]> => {
  const knex = KnexService.getInstance().knex;
  return knex('locked')
    .select('*')
    .catch((error) => {
      throw new InternalError(103, [error.message]);
    });
};

/**
 * Verifica se a sala está disponível na data informada.
 * Retorna true se não houver registro (ou seja, a sala está livre)
 * e false se a sala estiver bloqueada.
 */
export const checkRoomAvailability = async (room_id: number, day: Date): Promise<boolean> => {
  const knex = KnexService.getInstance().knex;
  return knex('locked')
    .select('*')
    .where({ room_id, day })
    .first()
    .then((lockedRecord) => {
      return lockedRecord ? false : true;
    })
    .catch((error) => {
      throw new InternalError(104, [error.message]);
    });
};
