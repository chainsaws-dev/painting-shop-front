export class User {
  public GUID: string;
  public Role: string;
  public Email: string;
  public Phone: string;
  public Name: string;
  public IsAdmin: boolean;
  public Confirmed: boolean;
  public SecondFactor: boolean;
  public Disabled: boolean;
  constructor(Role: string, Email: string, Phone: string, Name: string) {
    this.GUID = '';
    this.Role = Role;
    this.Email = Email;
    this.Phone = Phone;
    this.Name = Name;
    this.IsAdmin = false;
    this.Confirmed = false;
    this.SecondFactor = false;
    this.Disabled = false;
  }
}

export class UsersResponse {
  public Users: User[] = [];
  public Total!: number;
  public Offset!: number;
  public Limit!: number;
}

