export class TodoInterface {
  id: number;
  user_id: number;
  title: string;
  status: number;
  created_at: string;
  init(todo: any) {
    this.id = todo.id;
    this.user_id = todo.user_id;
    this.title = todo.title;
    this.status = todo.status;
    this.created_at = todo.created_at;

    return this;
  }
}
