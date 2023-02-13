interface SdkViewModel {
  title: string;
  href: string;
}

export class SdksViewModel {
  readonly sdks: SdkViewModel[] = [
    {
      title: 'Publisher',
      href: '/publisher',
    },
    {
      title: 'Subscriber',
      href: '/subscriber',
    },
  ];
}
