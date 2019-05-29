// 添加className
export function addClass(dom, className) {
  let newClassName = dom.className.split(' ');
  newClassName.push(className);
  dom.className = newClassName.join(' ');
}

// 移除className
export function removeClass(dom, className) {
  let newClassName = dom.className.split(' ').filter(name => {
    return name != className;
  });
  dom.className = newClassName.join(' ');
}
