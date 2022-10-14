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
