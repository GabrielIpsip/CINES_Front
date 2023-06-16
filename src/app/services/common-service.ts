import { EnvironmentService } from './environment.service';

export abstract class CommonService {

  public abstract get MERCURE_KEY(): string;

  protected constructor(
    private environmentService: EnvironmentService
  ) { }

  public getEventSource(): EventSource {
    const url = new URL(this.environmentService.environment.mercureUrl);
    url.searchParams.append('topic', this.MERCURE_KEY);
    return new EventSource(url.href);
  }
}
