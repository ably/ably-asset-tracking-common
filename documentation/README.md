# Documentation of Ably Asset Tracking Android SDKs

The [`publisher.dot`](publisher.dot) and [`subscriber.dot`](subscriber.dot) files in this repository contain graphs (in [Graphviz](https://graphviz.org) DOT format) documenting the relationships between various operations in the Android Asset Tracking SDKs.

They are based on the Android codebase at commit `2e490ab`.

They contain directed graphs, whose nodes represent operations and edges represent operation invocations. They don’t (currently, at least) document the sequencing of operation invocations or any conditional logic.

The operations covered are of the following types:

- worker queue workers
- methods of the `Ably` wrapper interface
- `Publisher/SubscriberInteractor` methods
- `CorePublisher/Subscriber` public methods
- `CorePublisher/Subscriber` private methods
- `DefaultSubscriber` public methods

This documentation is only intended to be informative, to help newcomers to the project get a rough idea of the key components of the SDK and how they interact.

## Viewer app

There is a web app in [`viewer`](./viewer) for viewing the graphs and generating useful subgraphs. See the [Readme](./viewer/README.md) for more information.
