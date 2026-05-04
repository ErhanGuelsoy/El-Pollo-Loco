class Endboss extends MovableObject{

    height = 400;
    width = 250;
    y = 50;

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png"
    ];

    IMAGE_Dead_Chicken = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    ]

    hadFirstContact = false;
    dead = false;
    
    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_Dead_Chicken);
        this.x = 2300;
        this.animate();
    
    }
    
    animate(){

        let i = 0;  

    setInterval(()=> {

        if (i < 10){
            this.playAnimation(this.IMAGES_WALKING);
        
        } else {
            this.playAnimation(this.IMAGES_WALKING) // muss noch angepasst werden auf anderen Skill
        }
            i++;

            if(world.character.x > 2800 && !hadFirstContact) { // muss noch schauen wie icha uf die x variable komme
                i = 0;
                hadFirstContact = 0;
            }


        }, 150);
        }
    }