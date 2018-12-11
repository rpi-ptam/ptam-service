;

import { Repository } from "../definitions/Repository";

import { User } from "../definitions/types/User";

/**
 * Users Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class UsersRepository extends Repository {

  public async create(user: User): Promise<number> {
    const statement = "INSERT INTO users (first_name, last_name, rcs_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await this.postgresDriver.query(statement, [user.first_name, user.last_name, user.rcs_id, user.role_id]);
    if (result.rowCount !== 1) throw Error("Could not create user");
    return result.rows[0]["id"];
  }

  public async getById(id: number): Promise<User|null> {
    const statement = "SELECT id, first_name, last_name, rcs_id, role_id FROM users WHERE id = $1";
    const result = await this.postgresDriver.query(statement, [id]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

  public async getByRcsId(rcsId: string): Promise<User|null> {
    const statement = "SELECT id, first_name, last_name, rcs_id, role_id FROM users WHERE rcs_id = $1";
    const result = await this.postgresDriver.query(statement, [rcsId]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

  public async updateRole(userId: number, roleId: number): Promise<number> {
    const statement = "UPDATE users SET role_id = $1 WHERE id = $2";
    const result = await this.postgresDriver.query(statement, [roleId, userId]);
    return result.rowCount;
  }

  public async removeById(userId: number) {
    const statement = "DELETE FROM users WHERE id = $1";
    await this.postgresDriver.query(statement, [userId]);
  }

}