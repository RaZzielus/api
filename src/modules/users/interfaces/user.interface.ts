export class UserInterface {
  id: string;
  name: string;
  email: string;
  created_at: string;
  init(user: any, access_token?: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.created_at = user.created_at;

    return this;
  }
}
