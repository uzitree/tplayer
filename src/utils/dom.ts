/*
 * @Author: 王嘉炀
 * @Date: 2020-03-29 21:52:10
 */
const trim = function (string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
export function hasClass (el: HTMLElement, cls: string): boolean {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export function addClass (el: HTMLElement, cls: string): void {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass (el: HTMLElement, cls: string): void {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export function append (el: HTMLElement, ...args: string[] | HTMLElement[]): void {
  let newChild
  for (let k = 0; k < args.length; k += 1) {
    newChild = args[k]
    if (typeof newChild === 'string') {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = newChild
      while (tempDiv.firstChild) {
        el.appendChild(tempDiv.firstChild)
      }
    } else {
      el.appendChild(newChild)
    }
  }
}
