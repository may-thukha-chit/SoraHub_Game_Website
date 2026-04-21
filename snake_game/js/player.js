class Player {
  constructor(name, id, isAI = false, avatar = '') {
      this.name = name;
      this.id = id;
      this.position = 0; 
      this.isAI = isAI;
      this.avatar = avatar;
      this.element = this.createToken();
  }

  createToken() {
      const el = document.createElement("div");
      el.classList.add("player-token", this.id); 
      el.innerText = this.avatar; 
      
      // Prevent tokens from perfectly overlapping
      if (this.id === 'player1') el.style.transform = 'translate(-5px, -5px)';
      if (this.id === 'player2') el.style.transform = 'translate(5px, 5px)';
      
      return el;
  }
}