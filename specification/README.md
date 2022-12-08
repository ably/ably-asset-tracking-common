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
