import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE OR REPLACE FUNCTION generate_hours() RETURNS TRIGGER AS $$
    DECLARE
      curr_time TIME;
      nxt_time TIME;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        DELETE FROM hours WHERE room_id = OLD.id;
        RETURN OLD;
      END IF;
      IF TG_OP = 'UPDATE' THEN
        DELETE FROM hours WHERE room_id = OLD.id;
      END IF;
      curr_time := NEW.opening_hour;
      WHILE curr_time < NEW.closing_hour LOOP
        nxt_time := curr_time + interval '1 hour';
        IF nxt_time > NEW.closing_hour THEN
          nxt_time := NEW.closing_hour;
        END IF;
        INSERT INTO hours (room_id, week_day, opening, closing, created_at, updated_at)
        VALUES (
          NEW.id,
          EXTRACT(DOW FROM NOW()),
          curr_time,
          nxt_time,
          NOW(),
          NOW()
        );
        curr_time := nxt_time;
      END LOOP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER trigger_generate_hours
    AFTER INSERT OR UPDATE OR DELETE ON rooms
    FOR EACH ROW EXECUTE FUNCTION generate_hours();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    DROP TRIGGER IF EXISTS trigger_generate_hours ON rooms;
    DROP FUNCTION IF EXISTS generate_hours;
  `);
}
