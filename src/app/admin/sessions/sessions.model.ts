export class Session {
  public Email!: string;
  public Token!: string;
  public Session!: string;
  public IssDate!: string;
  public ExpDate!: string;
  public Role!: string;
  public IP!: string;
  public UserAgent!: string;
}

export class SessionsResponse {
  public Sessions!: Session[];
  public Total!: number;
  public Offset!: number;
  public Limit!: number;
}

