# Change Log
All notable changes to this project will be documented in this file.

## [1.0.4] - 2017-04-05
### Fixed
- Forgot to publish build assets

## [1.0.3] - 2017-04-05
### Added
- Add `SnapTouch.resized` event
- Add private `setDimensions` method
- Add private `unsetDimensions` method
### Changed
- Set width of individual slides
- Unset dimensions before calculating slide width

## [1.0.2] - 2017-04-05
### Added
- Add cdn link to minified version
### Changed
- Use table syntax for method documentation

## [1.0.1] - 2017-04-05
### Added
- Add change log
- Add `SnapTouch.created` event
- Add `SnapTouch.destroyed` event
- Add `SnapTouch.activeIndexChanged` event
- Add `SnapTouch.positionChanged` event
- Add private method `activate`
- Add private method `deactivate`
- Add public method `addEventListener` for cleaner syntax on dispatched container events
- Add documentation on public methods
- Add documentation on public events
### Changed
- Refactor all references of slider to SnapTouch
- Rename private method `init` to `create`
- Rename private method `resetAllParams` to `resetParams`
- Rename private method `activateLink` to `setActiveLink`
- Rename private method `deactivateLinks` to `unsetActiveLinks`
- Rename private method `easeTowardsLink` to `easeTowardsTarget`
### Removed
- Remove private method `cloneObject`
- Remove private method `extendObject`
### Fixed
- When easing, check if position is out of bounds for `SnapTouch.easePositionEnd` event


## [1.0.0] - 2017-04-04
### Added
- Add snap-touch.js with demo
- Add gulp build tools to create production ready scripts
- Add package json

[Unreleased]: https://github.com/jabes/SnapTouch/compare/v1.0.4...HEAD
[1.0.3]: https://github.com/jabes/SnapTouch/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/jabes/SnapTouch/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/jabes/SnapTouch/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/jabes/SnapTouch/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/jabes/SnapTouch/commits/v1.0.0
