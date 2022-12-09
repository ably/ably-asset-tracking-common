# Ably Asset Tracking Specification

## Overview

This document is the formal, canonical specification describing the ecosystem, including requirements, shared by components of Ably's [Asset Tracking solution](https://ably.com/solutions/asset-tracking) (AAT).

## Error codes

The list of Ably Asset Tracking specific error codes.

| Code | Name | Description |
| ---- | ---- | ----------- |
| 100001 | Invalid message | The SDK received a message in an unexpected format. This is treated as a fatal protocol error and the transport will be closed with a failure. |
| 100002 | Fetching auth token error | The SDK was unable to fetch an auth token. The automatic retry mechanism won't be stopped.  |
| 100003 | Non retriable auth token error | The SDK was unable to fetch an auth token and won't try to fetch it again automatically. |

## Default resolution policy diagram

In this folder you can find the [`resolution_policy_diagram.svg`](resolution_policy_diagram.svg) file containing the default resolution policy diagram. It explains how the default resolution policy works, how each resolution is calculated and what triggers its recalculation. 
Additionally, the [`resolution_policy_diagram.drawio`](resolution_policy_diagram.drawio) file contains the source code for this diagram and can be edited in the [draw.io tool](https://draw.io) if the implementation changes in the future.

## Sending and receiving data

### Channel name

AAT uses Ably channels to send and receive location updates and other information. The channel name is created by prefixing a trackable ID with the `tracking:` namespace.
For example, trackable with ID `1234` will use `tracking:1234` channel to send and receive data.

### Data format

All data schemas are stored in the JSON Schema format in the [schemas](/test-resources/geo/schemas/) directory.
AAT sends two types of location updates: [raw](/test-resources/geo/schemas/raw-location-update.json) and [enhanced](/test-resources/geo/schemas/enhanced-location-update.json) ones.
The [locations](/test-resources/geo/schemas/location.json) are sent in the [GeoJSON](https://geojson.org/) format. 

## Core architectural decisions

### Reusing stopped client instances

After the client instance (Publisher or Subscriber) has stopped then it can never be used again. 
If customers want to use the SDK again they will have to create a new client instance.

### Multithreading: Handling asynchronous events safely

#### General approach to event handling

Because mobile development is asynchronous in nature we had to take special measures to ensure that our SDK is safe to be used from multiple threads.
Instead of choosing a mutex approach, we chose the approach of a synchronous events queue (similar to how the JS engine is implemented) to secure the SDK.
Therefore, we should always aim to use the queue to perform operations that require synchronization and manipulate the SDK state.

#### How the synchronous event queue works

When you have to perform work in the SDK you should enqueue the work in the synchronous queue.
Any work queued will be taken out from the queue in the FIFO order and processed one by one.
Additionally, the state of the SDK is only accessible from within the queue.
This ensures that the state is always manipulated in a secure, synchronous manner.

#### Running asynchronous operations from the synchronous event queue

Sometimes the work we perform on the queue will require us to run asynchronous operations.
As a general rule we do not want to block the queue to wait for async operations to complete because we can be doing other work during that time.
When async operations complete we resume the work that triggered them by queueing new work.

#### When SDK state can be manipulated

The SDK state should be only visible from within the queue (just like a local variable of a function).
The SDK state should only be accessed and modified from within the safe synchronous queue thread. 
This ensures that there are no races and the state is always synchronized.
You should never manipulate the state from the asynchronous operation listeners. Ideally the queue should be implemented in a way that will prevent it by design.
If you need to access or modify the state after some async operation completes then you should queue new work to the queue and perform the state manipulation from there.

#### Stopping the synchronous event queue

The only exception to the rule that asynchronous operations shouldn't block the queue is when the queue is being stopped.
If we wanted to wait for async operations after the queue stop operation was started we would have to introduce some kind of "stopping" state.
In this state the queue would not be stopped yet but it won't process any work as well since it is being stopped.
Instead when the queue is being stopped, the work is allowed to block the queue and wait for any async operations required to properly stop the SDK.
Thanks to this, no work except for the stopping work is being processed and once the stopping finishes we set the state to "stopped" and all other work that had been queued while stopping was in progress will now be discarded.
