export function initControls() {
  const world = document.querySelector('.world');
  const modal = document.querySelector('#detail');

  document.querySelector('#info').addEventListener('click', () => modal.showModal());
  document.querySelector('#close').addEventListener('click', () => modal.close());

  document.querySelector('#motion').addEventListener('click', function () {
    const paused = world.classList.toggle('paused');
    this.innerHTML = paused ? 'ACTIVAR SEÑAL <span>▷</span>' : 'PAUSAR SEÑAL <span>Ⅱ</span>';
    this.setAttribute('aria-pressed', String(!paused));
    document.querySelector('#status').textContent = paused ? 'EN PAUSA' : 'EN MOVIMIENTO';
  });

  document.querySelector('#invert').addEventListener('click', function () {
    const inverted = world.classList.toggle('inverted');
    this.setAttribute('aria-pressed', String(inverted));
  });

  world.addEventListener('pointermove', (event) => {
    document.querySelector('#x').textContent = String(Math.round(event.clientX)).padStart(3, '0');
    document.querySelector('#y').textContent = String(Math.round(event.clientY)).padStart(3, '0');
  });

  modal.addEventListener('click', (event) => {
    if (event.target !== modal) return;
    const bounds = modal.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) modal.close();
  });
}
