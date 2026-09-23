import { initControls } from './ui/controls.js';
import { initModel } from './scene/model.js?v=no-poster-2';

initControls();
initModel().catch((error) => {
  console.error('No se pudo cargar el modelo:', error);
  document.querySelector('#model').hidden = true;
  document.querySelector('#model-status').textContent = 'NO SE PUDO CARGAR EL 3D / RECARGA LA PÁGINA';
});
