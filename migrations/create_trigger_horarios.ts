import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE OR REPLACE FUNCTION generate_hours() RETURNS TRIGGER AS $$
    DECLARE
      current_time TIME;
      next_time TIME;
    BEGIN
      IF TG_OP = 'DELETE' THEN
        DELETE FROM hours WHERE room_id = OLD.id;
        RETURN OLD;
      END IF;
      IF TG_OP = 'UPDATE' THEN
        DELETE FROM hours WHERE room_id = OLD.id;
      END IF;
      current_time := NEW.opening_hour;
      WHILE current_time < NEW.closing_hour LOOP
        next_time := current_time + interval '1 hour';
        IF next_time > NEW.closing_hour THEN
          next_time := NEW.closing_hour;
        END IF;
        INSERT INTO hours (room_id, week_day, opening, closing, created_at, updated_at)
        VALUES (
          NEW.id,
          EXTRACT(DOW FROM NOW()),
          current_time,
          next_time,
          NOW(),
          NOW()
        );
        current_time := next_time;
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
