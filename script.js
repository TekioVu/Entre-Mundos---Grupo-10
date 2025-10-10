window.onload = function()
{
    var party = [
        {name: 'Goblin', id: 'goblin', hp: 10, maxHp: 20},
        {name: 'Espectro', id: 'espectro', hp: 50, maxHp: 50},
        {name: 'Amantes', id: 'amantes', hp: 5, maxHp: 20}
        /*{name: 'Corazon', id: 'corazon', hp: 50, maxHp: 50},
        {name: 'Soldado', id: 'soldado', hp: 50, maxHp: 50},
        {name: 'Troglodita', id: 'trolgodita', hp: 50, maxHp: 50},
        {name: 'Bufon', id: 'bufon', hp: 50, maxHp: 50},
        {name: 'Comediante', id: 'comediante', hp: 50, maxHp: 50}*/
    ];
    
    var canvas = document.querySelector("canvas");
    var context = canvas.getContext("2d");
    var lastRender = 0;

    function render() {
        requestAnimationFrame(function (t) {
        // Borra todo...
        context.clearRect(0, 0, 800, 600);
        // ...y repinta.
        renderParty(t);
        console.log('Delta time:', t - lastRender);
        lastRender = t;
        render();
        });
    }
    
    function renderParty(t) {
        renderBackground();
        renderCharacters(t); // pásale t a la función que pinta los enemigos.
        renderUI();
    }
    
    var bgImage = document.getElementById('background');
    function renderBackground() {
        context.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
    }

    var enemyImages = {
        'Goblin': new Image(),
        'Espectro': new Image(),
        'Amantes': new Image(),
        /*
        'Corazon': new Image(),
        'Soldado': new Image(),
        'Troglodita': new Image(),
        'Bufon': new Image(),
        'Comediante': new Image()
        */
    };
    
    enemyImages['Goblin'].src = 'assets/Enemigos/bat.png';
    enemyImages['Espectro'].src = 'assets/Enemigos/goblin.png';
    enemyImages['Amantes'].src = 'assets/Enemigos/goblin.png';

    /*enemyImages['Corazon'].src = 'assets/Enemigos/goblin.png';
    enemyImages['Soldado'].src = 'assets/Enemigos/goblin.png';
    enemyImages['Troglodita'].src = 'assets/Enemigos/goblin.png';
    enemyImages['Bufon'].src = 'assets/Enemigos/goblin.png';
    enemyImages['Comediante'].src = 'assets/Enemigos/goblin.png';
    */

    function renderCharacters(t) {

        var charaSpace = 800 / party.length;
        var centerOffset = charaSpace / 2;

        party.forEach(function (char, index) {
            var x = index * charaSpace + centerOffset;
            var y;
            var img;

            var width = 100; // ancho de la imagen
            var height = 100; // alto de la imagen
    
            if (char.name == 'Goblin') {
                img = enemyImages['Goblin'];
                y = 500;

            } else if (char.name === 'Espectro') {
                img = enemyImages['Espectro'];

                width = 200;
                height = 100;
                y = 20 * Math.sin(t / 200) + 300;
            } else if (char.name === 'Amantes') {

                img = enemyImages['Amantes'];
                width = 150;
                y = 400;
            }else {
                img = enemyImages['Amantes'];
            }
            
            context.drawImage(img, x - width / 2, y - height / 2, width, height);
        });
    }
    
    function renderUI() {
        var width = 100;
        var semiWidth = width / 2;
        var height = 20;
        var semiHeight = height / 2;
        var charaSpace = 800 / party.length;
        var centerOffset = charaSpace / 2;
        party.forEach(function (char, index) {
        var x = index * charaSpace + centerOffset;
        var y = 500;
        if (char.hp > 0) {
            var lifeArea = Math.floor(char.hp / char.maxHp * width);
            context.fillStyle = 'red';
            context.fillRect(x - semiWidth, y - semiHeight, lifeArea, height);
            context.lineWidth = 3;
            context.strokeStyle = 'black';
            context.strokeRect(x - semiWidth, y - semiHeight, width, height);
        }
        });
    }
    render();

}

