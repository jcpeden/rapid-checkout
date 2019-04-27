var oldTarget;
var onClick;

function onMouseMove(event) {

  event      = event || window.event;
  var target = event.target || event.srcElement;
  if (!target.dataset.editable) {
    return;
  }
  if (oldTarget) {
    resetOldTargetColor();
  }
  else {
    document.body.style.cursor = 'pointer';
  }
  oldTarget = target;
  highlightTarget(target);
}

function highlightTarget(target) {
  target.style.boxShadow = '0 0 0 3px #6faade';
}

function onMouseClick(event) {

  event      = event || window.event;
  var target = event.target || event.srcElement;
  if (event.preventDefault) event.preventDefault();
  if (event.stopPropagation) event.stopPropagation();
  onClick(oldTarget);
  return false

}

function reset() {

  document.removeEventListener('click', onMouseClick, false);
  document.removeEventListener('mousemove', onMouseMove, false);
  document.body.style.cursor = 'auto';
  if (oldTarget) {
    resetOldTargetColor();
  }
}

function resetOldTargetColor() {
  oldTarget.style.boxShadow = '';
}

function init(options) {

  if (!options || !options.onClick) {
    console.error('onClick option needs to be specified.');
    return;
  }
  var target = document;
  if (options.target) {
    target = document.querySelector(options.target);
  }
  onClick = options.onClick;
  target.addEventListener('click', onMouseClick, false);
  target.addEventListener('mousemove', onMouseMove, false);

  return elementPicker;

}

/**
 * The library object.
 * @property {Function} init    - Function called to init the library.
 * @property {Function} onClick - The callback triggered once an element is clicked.
 * @property {String} version   - The library's version.
 * @type {Object}
 */
var elementPicker     = {};
elementPicker.version = '1.0.1';
elementPicker.init    = init;

export default elementPicker;
