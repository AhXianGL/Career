import { useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
// simple hook for draggble dom
// TODO: add the dragable extent to prevent dragged dom run outside container or screen
// warning: cannot used on dom positioned by 'transform' css property
function useDragDOM(option = { hasHandler: true }) {
  let hasHandler = option.hasHandler
  const dragHandlerRef = useRef();
  const draggedDomRef = useRef();
  useEffect(() => {
    let handler = findDOMNode(dragHandlerRef.current);
    let wrapperDom = findDOMNode(draggedDomRef.current);
    if (false === hasHandler) {
      handler = wrapperDom;
    }
    let initialX = wrapperDom.getBoundingClientRect().x;
    let initialY = wrapperDom.getBoundingClientRect().y;
    let initialComputedTransformVal = window.getComputedStyle(wrapperDom);
    let initialMatrix = initialComputedTransformVal.getPropertyValue('transform')
    let targetIsPositionedByTransform = "none" !== initialMatrix
    // let initialMatrixValue = initialMatrix.match(/\((.+?)\)/g)
    // let initialMatrixValue = initialMatrix.match(/(?<=\()(.+?)(?=\))/g)[0].split(',')

    function handleHandlerMouseDown(e) {
      document.body.style.cursor = 'grab';
      document.onmousemove = handleDocumentMouseMove;
    }
    function documentMouseUp(e) {
      document.body.style.cursor = '';
      document.onmousemove = null;
    }
    function handleDocumentMouseMove(e) {
      document.body.style.cursor = 'grabbing';
      let deltaX = e.movementX;
      let deltaY = e.movementY;
      let preX = wrapperDom.getBoundingClientRect().x;
      let preY = wrapperDom.getBoundingClientRect().y;
      let currentX = Number(preX) + Number(deltaX);
      let currentY = Number(preY) + Number(deltaY);
      if(targetIsPositionedByTransform){
        wrapperDom.style.transform = `${initialMatrix} translateX(${currentX - initialX}px) translateY(${currentY - initialY}px)`;
      }else{
        wrapperDom.style.transform = `translateX(${currentX - initialX}px) translateY(${currentY - initialY}px)`;
      }
    }
    document.addEventListener('mouseup', documentMouseUp);
    handler.addEventListener('mousedown', handleHandlerMouseDown);
    return () => {
      handler.removeEventListener('mousedown', handleHandlerMouseDown);
      document.removeEventListener('mouseup', documentMouseUp);
      document.onmousemove = null;
    }
  }, [hasHandler])
  if (hasHandler) {
    return [draggedDomRef, dragHandlerRef]
  } else {
    return draggedDomRef
  }
}
export default useDragDOM