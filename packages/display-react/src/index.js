import React, { useEffect, useRef, forwardRef } from 'react'
import Controller from '@hubstairs/display-controller'

function Display({ displayid, productcode, token, displayUrl, oembedUrl, responsive = true, onError }, controller) {
  const displayRef = useRef()
  useEffect(() => {
    if (displayid && productcode) {
      try {
        controller.current && controller.current.destroy()
        controller.current = new Controller(displayRef.current, {
          displayid,
          productcode,
          token,
          responsive,
          oembedUrl,
          displayUrl,
        })
      } catch (e) {
        onError(e)
      }
    }
  }, [displayid, productcode, token, controller])

  return <div ref={displayRef} />
}

export default forwardRef(Display)
