# Ably Asset Tracking Specification

## Overview

This document is meant to be a formal, canonical specification describing the Ably Asset Tracking solution.

## Error codes

The list of Ably Asset Tracking specific error codes.

| Code   | Name            | Description                                                                                                                                    |
| ------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 100001 | Invalid message | The SDK received a message in an unexpected format. This is treated as a fatal protocol error and the transport will be closed with a failure. |
