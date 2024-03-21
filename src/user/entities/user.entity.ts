export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  roles: string[];
  active: "ACTIVE" | "INACTIVATE";

  constructor(id: number, username: string, email: string, password: string, roles: string[], active: "ACTIVE" | "INACTIVATE") {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.active = active;
  }
}