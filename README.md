# Ably Asset Tracking SDKs - Common Resources

![.github/workflows/check.yml](https://github.com/ably/ably-asset-tracking-common/workflows/.github/workflows/check.yml/badge.svg)

## Overview

Ably Asset Tracking SDKs provide an easy way to track multiple assets with realtime location updates powered by [Ably](https://ably.com/) realtime network and Mapbox [Navigation SDK](https://docs.mapbox.com/android/navigation/overview/) with location enhancement.

This repository provides a home for resources which need to be shared by multiple parts of the Ably Asset Tracking ecosystem, for example to store resources usable across multiple platforms.

Ably Asset Tracking is:

- **easy to integrate** - comprising two complementary SDKs with easy to use APIs, available for multiple platforms:
    - Asset Publishing SDK, for embedding in apps running on the courier's device
    - Asset Subscribing SDK, for embedding in apps runnong on the customer's observing device
- **extensible** - as Ably is used as the underlying transport, you have direct access to your data and can use Ably integrations for a wide range of applications in addition to direct realtime subscriptions - examples include:
    - passing to a 3rd party system
    - persistence for later retrieval
- **built for purpose** - the APIs and underlying functionality are designed specifically to meet the requirements of a range of common asset tracking use-cases

### Documentation

Visit the [Ably Asset Tracking](https://ably.com/documentation/asset-tracking) documentation for a complete API reference and code examples.

###  Further Reading

- [Introducing Ably Asset Tracking - public beta now available](https://ably.com/blog/ably-asset-tracking-beta)
- [Accurate Delivery Tracking with Navigation SDK + Ably Realtime Network](https://www.mapbox.com/blog/accurate-delivery-tracking)


## Validation of Resources

Where possible this repository self-validates its contents, checked as part of a CI workflow.

To run these tests locally you first need to install dependencies with `npm install`. Once these are installed tests are run with `npm test`. Note that these commands require an install of NodeJS (currently tested on v14).

## Usage in Downstream Repositories

We are including the entire contents of this repository in the working copies of the downstream repositories (a.k.a. superprojects) which depend on it. This allows us to simply include this repository as a Git [submodule](https://git-scm.com/docs/gitsubmodules) in those repositories which require these resources.

Downstream repositories should mount this repository at `external/common` using SSH, achieved using:

```sh
git submodule add git@github.com:ably/ably-asset-tracking-common.git external/common
```

The downstream repositories are:

- [ably-asset-tracking-android](https://github.com/ably/ably-asset-tracking-android): SDKs for Android
- [ably-asset-tracking-swift](https://github.com/ably/ably-asset-tracking-swift): SDKs for iOS
- [ably-asset-tracking-js](https://github.com/ably/ably-asset-tracking-js): SDK for Web Browsers (JavaScript)



