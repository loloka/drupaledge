/**
 * @file
 * js
 */
(function($) {
  Drupal.behaviors.drupalEdge = {attach: function(context, settings) {

    // All starts with reset() so here I should create all objects.

    /**
     * Canvas and buffer.
     */
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      buffer = document.createElement('canvas');

    canvas.id = 'stage';
    canvas.width = 512;
    canvas.height = 480;
    document.body.appendChild(canvas);

    // Set css id of the second canvas to 'buffer'.
    buffer.id = 'buffer';
    document.body.appendChild(buffer);

    /**
     * Buffer 'damaged' red effect in hidden canvas.
     * 
     * image - image to 'damage;
     * x, y - position where to 'damage'.
     */
    var buffer = function(image, x, y) {
      // Get the 'buffer' canvas (that isn`t visible to the user).
      var bufferCanvas = document.getElementById('buffer'),
        buffer = bufferCanvas.getContext('2d');

      // Draw your image to the buffer.
      buffer.drawImage(image, 0, 0);

      // Draw a rectangle over the image using a nice translucent overlay.
      buffer.save();
      buffer.globalCompositeOperation = 'source-in';
      buffer.fillStyle = 'rgba(186, 51, 35, 0.6)'; // red
      buffer.fillRect(0, 0, image.width, image.height);
      buffer.restore();

      // Copy the buffer onto the visible canvas.
      ctx.drawImage(bufferCanvas, x, y);
    };

    // Background image.
    var bg = {};
    bg.ready = false;
    bg.image = new Image();
    bg.image.onload = function() {
      bg.ready = true;
    };
    bg.image.src = '/sites/default/files/images/background.png';
    
//    var bg = {
//      ready: false,
//      image: new Image(),
//      image: {
//        onload: function() {
//          console.log(this);
//          this.ready = true;
//        },
//        src: '/sites/default/files/images/background.png'
//      }
//    };
//    console.log(bg.image);
    
    // Hero entity.
    var EntityHero = function(name) {
      this.name = name;
      this.ready = false;
      this.image = new Image();
      this.image.onload = function() {
        this.ready = true;
      };
      this.image.src = '/sites/default/files/images/hero.png';

      this.speed = 256;
      this.x = 0;
      this.y = 0;
    };

    // Hero Attack image.
    var EntityAttack = function(name) {
      this.name = name;
      this.ready = false;
      this.image = new Image();
      this.image.onload = function() {
        this.ready = true;
      };
      this.image.src = '/sites/default/files/images/attack.png';

      this.x = 0;
      this.y = 0;
    }

    // Monster entity.
    var Monster = function(name){
      this.name = 'monster_' + name;
      this.ready = false;
      this.image = new Image();
      this.image.onload = function() {
        this.ready = true;
      };
      this.image.src = '/sites/default/files/images/monster.png';

      this.health = 100;
      this.x = 0;
      this.y = 0;
      this.showDamage = false;
    };

    // Arrow entity.
    var EntityArrow = function(name) {
      this.name = name + '_arrow';
      this.ready = false;
      this.image = new Image();
      this.image.onload = function() {
        this.ready = true;
      };
      // x=4,y=80,w=7,h=16.
      this.image.src = '/sites/default/files/images/weapons.png';

      this.speed = 128;
      this.x = 0;
      this.y = 0;
    };

    var showCoords = function(event) {
      console.log(event.clientX + ', ' + event.clientY);
    };
    
    document.onmousemove=function(e){console.log(window.event);
      var evt = window.event, //cross browser event object
        element = evt.target,
        elementX = evt.clientX - element.canvas.x,
        elementY = evt.clientY - element.canvas.y;
      window.status=evt.clientX+" : "+evt.clientY;
      console.log(element);
      console.log(evt.clientX + ', ' + evt.clientY);
      
    }

    /**
     * Game objects.
     */
    var monsterCaught = 0,
      monsters = [],
      // For now, hero is the only 1, so object.
      hero = {},
      arrows = [],
      doAttack = false,
      doArrow = false,
      heroAttack = {};

    // Handle keyboard controls.
    var keysDown = {},
      mouseDown = {};

    addEventListener('keydown', function(e) {
      keysDown[e.keyCode] = true;
    }, false);

    addEventListener('keyup', function(e) {
      delete keysDown[e.keyCode];
    }, false);

    addEventListener('mousedown', function(e) {
      mouseDown[e.mouseCode] = true;
    }, false);

    addEventListener('mouseup', function(e) {
      delete mouseDown[e.mouseCode];
    }, false);

    /**
     * Reset the game when playr catches all of the monsters.
     */
    var reset = function() {

      // Make an array with monsters.
      monsters = [1,2,3,4,5];
      for (i in monsters) {
        monsters[i] = new Monster(i);
      }

      // Make a hero.
      hero = new EntityHero('viking');
      hero.x = canvas.width / 2;
      hero.y = canvas.height / 2;

      // Throw the monsters somewhere on the screen randomly.
      for (i in monsters) {
        monsters[i].x = 32 + (Math.random() * canvas.width - 64);
        monsters[i].y = 32 + (Math.random() * canvas.height - 64);
      }

      // Set coords of heroAttack, that it will be around his model.
      heroAttack = new EntityAttack();
      heroAttack.x = hero.x - 9;
      heroAttack.y = hero.y - 9;
    };

    // Update objects.
    var update = function(modifier) {
      if (87 in keysDown) { // Player holding W.
        hero.y -= hero.speed * modifier;
      }
      if (83 in keysDown) { // Player holding S.
        hero.y += hero.speed * modifier;
      }
      if (65 in keysDown) { // Player holding A.
        hero.x -= hero.speed * modifier;
      }
      if (68 in keysDown) { // Player holding D.
        hero.x += hero.speed * modifier;
      }

      if (32 in keysDown) {
        doAttack = true;
      }

      if (62 in keysDown) {
        doArrow.x +=
        doArrow = true;
      }


      // Are they touching?
      for (i in monsters) {
        if (
          doAttack
          && heroAttack.x <= (monsters[i].x + 32)
          && monsters[i].x <= (heroAttack.x + 48)
          && heroAttack.y <= (monsters[i].y + 32)
          && monsters[i].y <= (heroAttack.y + 48)
        ) {
          --monsters[i].health;
          monsters[i].showDamage = true;
          if (monsters[i].health == 0) {
            ++monsterCaught;
            monsters.splice(i, 1);
            if (!monsters.length) {
              reset();
            }
          }
        }
      }
    };

    // Draw everything.
    var render = function() {
      if (bg.ready) {
        ctx.drawImage(bg.image, 0, 0);
      }

//      if (hero.ready) {
        ctx.drawImage(hero.image, hero.x, hero.y);
//      }

      // Draw monsters. Ready doesn`t work here, image.onload can`t act.
      for (i in monsters) {
//        if (monsters[i].ready) {
          ctx.drawImage(monsters[i].image, monsters[i].x, monsters[i].y);
          ctx.fillText(monsters[i].health, monsters[i].x, monsters[i].y - 20);
//        }

        // Show damaged monster.
        if (monsters[i].showDamage) {
          buffer(monsters[i].image, monsters[i].x, monsters[i].y);
          monsters[i].showDamage = false;
        }
      }

      // Draw mellee attack.
      if (doAttack) {
        heroAttack.x = hero.x - 9;
        heroAttack.y = hero.y - 9;
        ctx.drawImage(heroAttack.image, heroAttack.x, heroAttack.y);
        doAttack = false;
      }


      // Score.
      ctx.fillStyle = 'rgb(250, 250, 250)';
      ctx.font = '24px Helvetica';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Goblins caught: ' + monsterCaught, 32, 32);
    };

    // The main game loop.
    var main = function() {
      var now = Date.now(),
        delta = now - then;

      update(delta / 1000);
      render();

      then = now;
    };

    // Start the game!
    reset();
    var then = Date.now();
    setInterval(main, 1); // Execute as fast as possible.

  }};
})(jQuery);