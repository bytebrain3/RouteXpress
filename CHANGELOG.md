# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-11

Adds two new courier providers — **PaperFly** and **EcoCourier** — bringing the
library to six unified providers alongside Steadfast, Pathao, RedX, and CarryBee.

### Added

- **PaperFly** provider (`src/controllers/paperfly`):
  - Order creation, order tracking, and order cancellation.
  - `PaperflyWebhookHandler` with secret-based verification, wired through the
    unified webhook config.
  - `validatePaperflyOrder` validator exported from the package root.
- **EcoCourier** provider (`src/controllers/ecourier`):
  - Order creation, order tracking, and order cancellation.
  - Package listing (`getPackages`) and payment status lookup (`getPaymentStatus`).
  - Fraud check (`fraudCheck`), plus a top-level `ecourierFraudCheck(number)` helper.
  - Location data: cities, thanas, areas, and branches.
  - Child parcel operations: `trackChild` and `cancelChildOrder`.
  - `validateEcourierOrder` validator exported from the package root.
- Provider config types `Paperfly_Config` and `Ecourier_Config`, and
  `PaperflyWebhookConfig`, added to the public `Config` type.
- Package subpath exports for `./controllers/paperfly` and `./controllers/ecourier`.
- New `paperfly` and `ecourier` keywords in `package.json`.

### Changed

- Unified `createOrder` now routes to `paperfly` and `ecourier` in addition to the
  existing providers.
- `getWebhookUrl` accepts `paperfly` as a provider.
- `getPaperfly()` and `getEcourier()` accessor methods added to the `RouteXpress` client.

[1.2.0]: https://github.com/bytebrain3/RouteXpress/compare/v1.1.1...v1.2.0
