
export class JobOjs {
  id: string;
  corpus: string;
  descriptionLabel: string;
  descriptionUrl: string;
  started: Date;
  estimation: string;
  status: string;
  progress: number;

  constructor(
    id: string,
    corpus: string,
    descriptionLabel: string,
    descriptionUrl: string,
    started: Date,
    estimation: string,
    status: string,
    progress: number
  ) {
    this.id = id;
    this.corpus = corpus;
    this.descriptionLabel = descriptionLabel;
    this.descriptionUrl = descriptionUrl;
    this.started = started;
    this.estimation = estimation;
    this.status = status;
    this.progress = progress;
  }
}
