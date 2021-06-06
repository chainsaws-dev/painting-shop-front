export class FiLe {
  public ID: number;
  public FileName: string;
  public FileSize: number;
  public FileType: string;
  public FileID: string;
  public PreviewID: string;

  constructor(fname: string, fsize: number, ftype: string, flink: string, plink: string, ID: number) {
    this.FileName = fname;
    this.FileSize = fsize;
    this.FileType = ftype;
    this.FileID = flink;
    this.ID = ID;
    this.PreviewID = plink;
  }
}

export class FilesResponse {
  public Files: FiLe[] = [];
  public Total!: number;
  public Offset!: number;
  public Limit!: number;
}
