import Controller from '@hubstairs/display-js'
import React, { forwardRef, useEffect, useRef } from 'react'

function useLatest(callback) {
  const ref = useRef(callback)
  useEffect(() => {
    ref.current = callback
  })

  return ref
}

function registerEvent(controller, name, callbackRef) {
  const callback = e => callbackRef.current(e)
  controller.current.on(name, callback)

  return callback
}

function unRegisterEvent(controller, name, callbackFromRegister) {
  controller.current.off(name, callbackFromRegister)
}

const EVENTS = {
  PRODUCT_CLICK: 'poductClick',
  CHANGE_SCENE: 'changeScene',
  CHANGE_PRODUCT_LOCATION: 'changeSelectedProductLocation',
  LOAD_SCENE: 'loadScene',
  CHANGE_PRODUCT: 'changeProduct',
  FILTER: 'filter',
  ERROR: 'error',
}

// TODO add `componentDidCatch`
function Display(
  {
    displayid,
    productcode,
    token,
    config,
    displayUrl,
    oembedUrl,
    responsive = true,
    onError,
    onProductClick,
    onReady,
    onFilter,
    onLoadScene,
    onChangeScene,
    onChangeProductLocation,
    onChangeProduct,
    noCache,
    language,
  },
  controller,
) {
  const displayRef = useRef()
  const controllerRef = useRef()
  const ctrl = controller || controllerRef
  const onErrorStable = useLatest(onError)
  const onChangeSceneStable = useLatest(onChangeScene)
  const onChangeProductLocationStable = useLatest(onChangeProductLocation)
  const onLoadSceneStable = useLatest(onLoadScene)
  const onChangeProductStable = useLatest(onChangeProduct)
  const onProductClickStable = useLatest(onProductClick)
  const onFilterStable = useLatest(onFilter)
  const onReadyStable = useLatest(onReady)

  useEffect(() => {
    if (ctrl.current && config) {
      ctrl.current.setConfig(config)
    }
  }, [ctrl, config])

  useEffect(() => {
    if (displayid && token) {
      try {
        ctrl.current = new Controller(displayRef.current, {
          displayid,
          productcode,
          token,
          responsive,
          oembedUrl,
          displayUrl,
          noCache,
          language,
        })

        if (onReadyStable.current || onErrorStable.current) {
          const onReady = e => onReadyStable.current(e)
          const onError = e => onErrorStable.current(e)
          ctrl.current
            .ready()
            .then(() => {
              onReadyStable.current && onReady()
            })
            .catch(e => {
              onErrorStable.current && onError(e)
            })
        }

        const callbackOnLoadScene = registerEvent(ctrl, EVENTS.LOAD_SCENE, onLoadSceneStable)
        const callbackOnChangeScene = registerEvent(ctrl, EVENTS.CHANGE_SCENE, onChangeSceneStable)
        const callbackOnChangeProduct = registerEvent(ctrl, EVENTS.CHANGE_PRODUCT, onChangeProductStable)
        const callbackOnChangeProductLocationStable = registerEvent(
          ctrl,
          EVENTS.CHANGE_PRODUCT_LOCATION,
          onChangeProductLocationStable,
        )
        const callbackOnError = registerEvent(ctrl, EVENTS.ERROR, onErrorStable)
        const callbackOnProductClick = registerEvent(ctrl, EVENTS.PRODUCT_CLICK, onProductClickStable)
        const callbackOnFilter = registerEvent(ctrl, EVENTS.FILTER, onFilterStable)
        return () => {
          unRegisterEvent(ctrl, EVENTS.LOAD_SCENE, callbackOnLoadScene)
          unRegisterEvent(ctrl, EVENTS.CHANGE_SCENE, callbackOnChangeScene)
          unRegisterEvent(ctrl, EVENTS.CHANGE_PRODUCT, callbackOnChangeProduct)
          unRegisterEvent(ctrl, EVENTS.CHANGE_PRODUCT_LOCATION, callbackOnChangeProductLocationStable)
          unRegisterEvent(ctrl, EVENTS.PRODUCT_CLICK, callbackOnProductClick)
          unRegisterEvent(ctrl, EVENTS.FILTER, callbackOnFilter)
          unRegisterEvent(ctrl, EVENTS.ERROR, callbackOnError)
          ctrl.current.destroy()
        }
      } catch (e) {
        onErrorStable?.current && onErrorStable.current(e)
      }
    } else {
      onErrorStable?.current && onErrorStable.current('missing "displayid" or "token" paramater')
    }
  }, [
    displayid,
    productcode,
    token,
    ctrl,
    responsive,
    oembedUrl,
    displayUrl,
    onErrorStable,
    onLoadSceneStable,
    onChangeSceneStable,
    onChangeProductLocationStable,
    controller,
    onProductClickStable,
    onChangeProductStable,
    onFilterStable,
    onReadyStable,
    noCache,
    language,
  ])

  return <div ref={displayRef} />
}

export default forwardRef(Display)
