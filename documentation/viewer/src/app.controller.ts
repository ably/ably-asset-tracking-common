import { Controller, Get, Header, Param, Query, Render } from '@nestjs/common';
import { AppService, DataSource, RelatedNodes } from './app.service';
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
    return this.appService.generateFullSvgDiagram('publisher');
  }

  @Get('subscriber/diagram')
  @Header('Content-Type', 'image/svg+xml')
  async generateSubscriberSvgDiagram(): Promise<string> {
    return this.appService.generateFullSvgDiagram('subscriber');
  }

  @Get('publisher/diagram/:nodeName')
  @Header('Content-Type', 'image/svg+xml')
  async generatePublisherSvgDiagramForNode(
    @Param() params,
    @Query('relatedNodes') relatedNodes,
  ): Promise<string> {
    return this.appService.generateSvgDiagramForNode(
      'publisher',
      params.nodeName,
      relatedNodes === 'callers' ? RelatedNodes.Callers : RelatedNodes.Callees,
    );
  }

  @Get('subscriber/diagram/:nodeName')
  @Header('Content-Type', 'image/svg+xml')
  async generateSubscriberSvgDiagramNode(
    @Param() params,
    @Query('relatedNodes') relatedNodes,
  ): Promise<string> {
    return this.appService.generateSvgDiagramForNode(
      'subscriber',
      params.nodeName,
      relatedNodes === 'callers' ? RelatedNodes.Callers : RelatedNodes.Callees,
    );
  }

  private async listNodes(source: DataSource): Promise<SdkDetailsViewModel> {
    const subgraphs = await this.appService.getSubgraphs(source);
    return new SdkDetailsViewModel(source, subgraphs);
  }
}
