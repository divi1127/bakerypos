const PAGE = {
  thermal: { page: '80mm 297mm', margin: '4mm' },
  a4: { page: 'A4 portrait', margin: '12mm' },
}

export const PRINT_SIZES = [
  { id: 'thermal', label: '80mm Thermal', hint: 'Counter roll printer' },
  { id: 'a4', label: 'A4 Sheet', hint: 'Full page or PDF' },
]

export function printSizeConfig(size) {
  return PAGE[size] ? size : 'thermal'
}

export function applyPrintSize(size) {
  const id = printSizeConfig(size)
  const conf = PAGE[id]
  document.documentElement.dataset.printSize = id
  let tag = document.getElementById('bb-print-style')
  if (!tag) {
    tag = document.createElement('style')
    tag.id = 'bb-print-style'
    document.head.appendChild(tag)
  }
  tag.textContent = `@page { size: ${conf.page}; margin: ${conf.margin}; }`
}

function detachPrintAreas() {
  const areas = Array.from(document.querySelectorAll('.print-area'))
  if (!areas.length) return null
  const holder = document.createElement('div')
  holder.className = 'bb-print-holder'
  document.body.appendChild(holder)
  const moves = areas.map((el) => {
    const placeholder = document.createComment('bb-print-area')
    el.parentNode.insertBefore(placeholder, el)
    holder.appendChild(el)
    return { el, placeholder }
  })
  return () => {
    moves.forEach(({ el, placeholder }) => {
      if (placeholder.parentNode) placeholder.parentNode.replaceChild(el, placeholder)
    })
    holder.remove()
  }
}

export function printBill(size = 'thermal') {
  applyPrintSize(size)
  const restore = detachPrintAreas()
  const previous = window.onafterprint
  const done = () => {
    window.onafterprint = previous
    restore?.()
  }
  window.onafterprint = done
  window.print()
  window.setTimeout(done, 1500)
}
