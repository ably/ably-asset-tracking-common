# Ably Asset Tracking SDKs Documentation Browser

## Description

A web app for viewing the Ably Asset Tracking SDK call graphs contained in the following files:

- `../publisher.dot`
- `../subscriber.dot`

These graphs have a lot of nodes and edges, and are not very easy to view in their entirety. This app lets you view a filtered subset of a graph, displaying only the nodes reachable from a given starting node. For example, by choosing the `addTrackable` method of `CorePublisher`, you can view all the work that this method call triggers.

## Requirements

- Node.js
- [Graphviz](https://graphviz.org) (for example on macOS you can install with `brew install graphviz`)

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```

You can then access the service by visiting [http://localhost:3000](http://localhost:3000) in a web browser.
