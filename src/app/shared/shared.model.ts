export class Ingredient{
    constructor(public Name: string, public Amount: number){}
}

export class ShoppingListResponse {
  public Items: Ingredient[] = [];
  public Total!: number;
  public Offset!: number;
  public Limit!: number;
}

export class ErrorResponse {

  public Error: BackendError;

  constructor(Code: number, Message: string) {
    this.Error = new BackendError(Code, Message);
  }
}

export class BackendError {

  public Code: number;
  public Message: string;

  constructor(Code: number, Message: string) {
    this.Code = Code;
    this.Message = Message;
  }
}

export class Pagination {
  public Total: number;
  public Limit: number;
  public Offset: number;
  constructor(Total: number, Limit: number, Offset: number) {
    this.Total = Total;
    this.Limit = Limit;
    this.Offset = Offset;
  }
}
