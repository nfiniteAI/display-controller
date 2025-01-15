# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0](https://github.com/hubstairs/display-controller/compare/v1.9.0...v2.0.0) (2025-01-15)


### ⚠ BREAKING CHANGES

* The content inside your container is now a web-component but not an iframe
You can still fallback to the old mode by passing `embedMode: iframe` in the options
* You cannot use an existing iframe anymore
* You cannot use anymore data-hubstairs attributes as options parameters on your container

### Features

* app embedMode JS ([cb98a47](https://github.com/hubstairs/display-controller/commit/cb98a47289f827a39338061dfd484a452f3c1126))
* embed js display model (!142) ([6a60ab7](https://github.com/hubstairs/display-controller/commit/6a60ab7b31dfefc5079f81bbc2c236039fe4530d))
* remove insertion with a preexisting iframe ([5947c05](https://github.com/hubstairs/display-controller/commit/5947c05bb2ef5cc09be42afeebbf0f517d1e01f5))
* remove insertion with html attributes ([538e83c](https://github.com/hubstairs/display-controller/commit/538e83cacb7f39f15836065c09132a9de01f4da4))


### Bug Fixes

* **display-js:** render webcomponent on insert ([8262654](https://github.com/hubstairs/display-controller/commit/826265402aebdecd4e9ebff2be2ef2fcb47c8ee1))



## [1.9.0](https://github.com/hubstairs/display-controller/compare/v1.8.0...v1.9.0) (2024-03-25)


### Features

* props labelProductClick sent to controller ([996da03](https://github.com/hubstairs/display-controller/commit/996da032a0970c027392929621b0b4820ffd6f13))



### [1.7.2](https://github.com/hubstairs/display-controller/compare/v1.7.1...v1.7.2) (2024-02-22)


### Bug Fixes

* integration mode with existing iframe ([9ae67aa](https://github.com/hubstairs/display-controller/commit/9ae67aa02a53db7c88ce0723cfabaaf9ae4eb37e))



## [1.7.0](https://github.com/hubstairs/display-controller/compare/v1.6.1...v1.7.0) (2022-07-29)


### Features

* add initialProducts and initialProductsMode options ([c809865](https://github.com/hubstairs/display-controller/commit/c809865a8f32f3a51d0217fbae4219b96c3cfe83))



## [1.5.0](https://github.com/hubstairs/display-controller/compare/v1.4.0...v1.5.0) (2022-05-17)


### Features

* **display-js:** prepare resize function for the future ([1fe50bf](https://github.com/hubstairs/display-controller/commit/1fe50bf06915685fee0db8740e1b96629e871806))


### Bug Fixes

* **display-js:** error when a comment is inside the display container div ([3f5ae72](https://github.com/hubstairs/display-controller/commit/3f5ae72dbbf402f1dd2d8989228ae825afc2c344))



## [1.4.0](https://github.com/hubstairs/display-controller/compare/v1.3.1...v1.4.0) (2022-02-01)


### Features

* new url for oembed API ([0f343b8](https://github.com/hubstairs/display-controller/commit/0f343b8acac74afd35e1d893b30db6a28adb2806))



### [1.3.1](https://github.com/hubstairs/display-controller/compare/v1.3.0...v1.3.1) (2021-05-26)


### Bug Fixes

* use nfinite urls ([2b43ba0](https://github.com/hubstairs/display-controller/commit/2b43ba08de319c76d9e001ff34b9e5e78af6a7af))



## [1.3.0](https://github.com/hubstairs/display-controller/compare/v1.2.0...v1.3.0) (2021-03-03)


### Features

* manage hubstairs.io urls ([7a8e39b](https://github.com/hubstairs/display-controller/commit/7a8e39bf8856350a0166a29eaf5a4a7e4bf0b00c))



## [1.2.0](https://github.com/hubstairs/display-controller/compare/v1.1.1...v1.2.0) (2021-02-03)


### Features

* manage nfinite.app urls ([c91c3ad](https://github.com/hubstairs/display-controller/commit/c91c3adb0c2d38b6fa38be602d5dc2fc44321950))



## [1.1.0](https://github.com/hubstairs/display-controller/compare/v1.0.0...v1.1.0) (2020-11-05)

**Note:** Version bump only for package @hubstairs/display-js





# [0.2.0](https://gitlab.com/hubstairs/front/npm-modules/display-controller/compare/v0.1.0...v0.2.0) (2020-07-24)


### Bug Fixes

* memory leak on destroy ([65cd1aa](https://gitlab.com/hubstairs/front/npm-modules/display-controller/commit/65cd1aa74fc1a091bf540b0eae7bdcd85b3d45f4))





# [0.1.0](https://gitlab.com/hubstairs/front/npm-modules/display-controller/compare/v0.0.9...v0.1.0) (2020-07-07)

### Features

- no cache option ([316b80d](https://gitlab.com/hubstairs/front/npm-modules/display-controller/commit/316b80d73273606f6b7433cfe0996597371a9076))
- **display-react:** add errors in onError props ([b578fca](https://gitlab.com/hubstairs/front/npm-modules/display-controller/commit/b578fca33a882390f7ad9be3122e2208fdf36115))

## 0.0.9 (2020-06-26)

**Note:** Version bump only for package @hubstairs/display-js
