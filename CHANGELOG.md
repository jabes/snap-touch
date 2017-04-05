# Change Log
All notable changes to this project will be documented in this file.

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

[1.0.1]: https://github.com/jabes/SnapTouch/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/jabes/SnapTouch/tree/v1.0.0
