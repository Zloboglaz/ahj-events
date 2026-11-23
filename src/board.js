export class Board {
  constructor(element, imageUrl) {
    this.element = element;
    this.cells = [];
    this.current = -1;

    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      this.element.append(cell);
      this.cells.push(cell);
    }

    this.goblin = document.createElement('img');
    this.goblin.src = imageUrl;
    this.goblin.alt = 'Гоблин';
    this.goblin.draggable = false;
  }

  showGoblin() {
    let next;
    if (this.current === -1) {
      next = Math.floor(Math.random() * this.cells.length);
    } else {
      next = Math.floor(Math.random() * (this.cells.length - 1));
      if (next >= this.current) {
        next++;
      }
    }
    this.current = next;
    this.cells[this.current].append(this.goblin);
  }

  hideGoblin() {
    this.goblin.remove();
  }

  isVisible() {
    return this.goblin.parentElement !== null;
  }

  isHit(target) {
    return this.isVisible() && this.goblin.parentElement.contains(target);
  }
}
