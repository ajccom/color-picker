var colorPicker = (function () {
  var ev = null, min = 0, max = 150, HSV = [0, 1, 1], svPicker, svBox, hPicker, hBox, previewColorBox, hexBox, dom
  
  function edge (num, min, max) {
    if (num < min) { return min }
    if (num > max) { return max }
    return num
  }
  
  function bind (dom, cb) {
    var doc = $(document)
    
    svPicker = dom.querySelector('.sv-picker')
    svBox = dom.querySelector('.sv-box')
    hPicker = dom.querySelector('.h-picker')
    hBox = dom.querySelector('.h-box')
    previewColorBox = dom.querySelector('.color')
    hexBox = dom.querySelector('.hex')
    
    ev = (function () {
      var startLeft, startTop, startX, startY, deltaX, deltaY, isTouch = false, isMove = false, currentDom = null, timer = null, currentPicker = null, currentGBCR = null
    
      function whenMouseDownOnHBox (e) {
        isTouch = true
        currentDom = hBox
        currentPicker = hPicker
        e.preventDefault()
        e.stopPropagation()
        startX = e.clientX
        startY = e.clientY
        
        startTop = startY
        
        currentGBCR = currentDom.getBoundingClientRect()
        
        var top = edge(startTop - currentGBCR.top, min, max)
        currentPicker.style.top = top + 'px'
        
        calcH(top)
        
        cb && cb(getRGB(), getHEX())
      }
      
      function whenMouseDownOnSVBox (e) {
        isTouch = true
        currentDom = svBox
        currentPicker = svPicker
        e.preventDefault()
        e.stopPropagation()
        startX = e.clientX
        startY = e.clientY
        
        startLeft = startX
        startTop = startY
        
        currentGBCR = currentDom.getBoundingClientRect()
        
        var top = edge(startTop - currentGBCR.top, min, max),
          left = edge(startLeft - currentGBCR.left, min, max)
        currentPicker.style.left = left + 'px'
        currentPicker.style.top = top + 'px'
        
        calcSV(left, top)
        
        cb && cb(getRGB(), getHEX())
      }
      
      function whenMouseMove (e) {
        if (!isTouch) {return}
        
        deltaX = e.clientX - startX
        deltaY = e.clientY - startY
        
        isMove = true
      }
      
      function whenMouseUp (e) {
        if (!isTouch) {return}
        
        deltaX = e.clientX - startX
        deltaY = e.clientY - startY
        
        isTouch = false
        currentDom = null
      }
      
      timer = setInterval(calc, 30)
      
      function calc () {
        if (!isMove) {return}
        
        isMove = false
        
        var left = startLeft - currentGBCR.left + deltaX,
          top = startTop - currentGBCR.top + deltaY
        
        top = edge(top, min, max)
        left = edge(left, min, max)
          
        if (currentPicker === hPicker) {
          currentPicker.style.top = top + 'px'
          
          calcH(top)
        } else {
          currentPicker.style.left = left + 'px'
          currentPicker.style.top = top + 'px'
          
          calcSV(left, top)
        }
        
        cb && cb(getRGB(), getHEX())
      }
      
      function clear () {
        clearInterval(timer)
      }
      
      return {
        whenMouseDownOnHBox: whenMouseDownOnHBox,
        whenMouseDownOnSVBox: whenMouseDownOnSVBox,
        whenMouseMove: whenMouseMove,
        whenMouseUp: whenMouseUp,
        clear: clear
      }
    }());
    
    doc.on('mousedown', '.h-box', ev.whenMouseDownOnHBox)
    
    doc.on('mousemove', ev.whenMouseMove)
    
    doc.on('mouseup', ev.whenMouseUp)
    
    doc.on('mousedown', '.sv-box', ev.whenMouseDownOnSVBox)
  }
  
  function unbind (dom) {
    var doc = $(document)
          
    doc.off('mousedown', '.h-box', ev.whenMouseDownOnHBox)
    
    doc.off('mousemove', ev.whenMouseMove)
    
    doc.off('mouseup', ev.whenMouseUp)
    
    doc.off('mousedown', '.sv-box', ev.whenMouseDownOnSVBox)
    
    ev.clear()
  }
  
  function init (parentNode, onChange) {
    var html = '<div class="sv-box"><i class="sv-picker"></i></div><div class="h-box"><i class="h-picker"></i></div><div class="preview"><span class="color"></span><span class="hex">#ff0000</span></div>'
    
    dom = document.createElement('div')
    
    dom.innerHTML = html
    
    dom.classList.add('color-picker')
    
    if (typeof parentNode === 'function') {
      onChange = parentNode
      parentNode = null
    }
    
    bind(dom, onChange)
    
    if (parentNode && parentNode.appendChild) {
      parentNode.appendChild(dom)
    }
    
    return dom
  }
  
  function calcH (top) {
    HSV[0] = (max - top) / max
    
    var rgb = HSV2RGB(HSV[0], 1, 1)
    svBox.style.backgroundColor = 'rgb(' + rgb.join(',') + ')'
    
    rgb = HSV2RGB(HSV[0], HSV[1], HSV[2])
    previewColorBox.style.backgroundColor = 'rgb(' + rgb.join(',') + ')'
    
    hexBox.innerHTML = '#' + RGB2HEX(rgb)
  }
  
  function calcSV (left, top) {
    HSV[1] = 1 - ((max - left) / max)
    HSV[2] = (max - top) / max
    
    var rgb = HSV2RGB(HSV[0], HSV[1], HSV[2])
    previewColorBox.style.backgroundColor = 'rgb(' + rgb.join(',') + ')'
    
    hexBox.innerHTML = '#' + RGB2HEX(rgb)
  }
  
  function HSV2RGB (h, s, v) {
    var r, g, b, i, f, p, q, t
    
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    i = i || 0
    q = q || 0
    t = t || 0
    switch (i % 6) {
      case 0:
          r = v, g = t, b = p
          break
      case 1:
          r = q, g = v, b = p
          break
      case 2:
          r = p, g = v, b = t
          break
      case 3:
          r = p, g = q, b = v
          break
      case 4:
          r = t, g = p, b = v;
          break;
      case 5:
          r = v, g = p, b = q
          break
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
  
  function RGB2HEX(a) {
    var s = +a[2] | (+a[1] << 8) | (+a[0] << 16);
    s = '000000' + s.toString(16);
    return s.slice(-6);
  }
  
  function destory () {
    unbind()
    
    dom.parentNode.removeChild(dom)
    
    dom = null
  }
  
  function getRGB () {
    return HSV2RGB(HSV[0], HSV[1], HSV[2])
  }
  
  function getHEX () {
    return hexBox.innerHTML.replace('#', '')
  }
  
  return {init, destory, getRGB, getHEX}
}());
