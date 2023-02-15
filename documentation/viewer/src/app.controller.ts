import { Controller, Get, Header, Param, Render } from '@nestjs/common';
import { AppService, DataSource } from './app.service';
import { SdkDetailsViewModel } from './sdkDetails.viewModel';
import { SdksViewModel } from './sdks.viewModel';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('sdks')
  listSdks(): SdksViewModel {
    return new SdksViewModel();
  }

  @Get('/publisher')
  @Render('sdkDetails')
  async listPublisherNodes(): Promise<SdkDetailsViewModel> {
    return this.listNodes('publisher');
  }

  @Get('/subscriber')
  @Render('sdkDetails')
  async listSubscriberNodes(): Promise<SdkDetailsViewModel> {
    return this.listNodes('subscriber');
  }

  @Get('publisher/diagram')
  @Header('Content-Type', 'image/svg+xml')
  async generatePublisherSvgDiagram(): Promise<string> {
    return this.appService.generateSvgDiagram('publisher', null);
  }

  @Get('subscriber/diagram')
  @Header('Content-Type', 'image/svg+xml')
  async generateSubscriberSvgDiagram(): Promise<string> {
    return this.appService.generateSvgDiagram('subscriber', null);
  }

  @Get('publisher/diagram/:nodeName')
  @Header('Content-Type', 'image/svg+xml')
  async generatePublisherSvgDiagramForNode(@Param() params): Promise<string> {
    return this.appService.generateSvgDiagram('publisher', params.nodeName);
  }

  @Get('subscriber/diagram/:nodeName')
  @Header('Content-Type', 'image/svg+xml')
  async generateSubscriberSvgDiagramNode(@Param() params): Promise<string> {
    return this.appService.generateSvgDiagram('subscriber', params.nodeName);
  }

  private async listNodes(source: DataSource): Promise<SdkDetailsViewModel> {
    const subgraphs = await this.appService.getSubgraphs(source);
    return new SdkDetailsViewModel(source, subgraphs);
  }
}
