import Phaser from "phaser";
import ingredientsSprite from "../sprites/ingredients.png"
import texturesSprite from "../sprites/textures.png" 

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene")
    }

    preload() {
        this.load.image("food_atlas", ingredientsSprite)
        this.load.image("cafe_atlas", texturesSprite)
    }

    create() {
        const foodAtlas = this.textures.get("food_atlas")
        const cafeAtlas = this.textures.get("cafe_atlas")

        // Текстуры для еды
        foodAtlas.add("coffee", 0, 3, 1, 25, 30)
        foodAtlas.add("milk", 0, 38, 2, 20, 29)
        foodAtlas.add("sugar", 0, 69, 1, 21, 29)
        foodAtlas.add("vanile_syrup", 0, 105, 1, 14, 31)
        foodAtlas.add("caramel_syrup", 0, 137, 1, 14, 31)
        foodAtlas.add("chocolate_syrup", 0, 9, 33, 14, 31)
        foodAtlas.add("cinnamon", 0, 39, 42, 17, 20)
        foodAtlas.add("cacao", 0, 70, 37, 20, 25)
        foodAtlas.add("croissant", 0, 99, 37, 27, 24)
        foodAtlas.add("muffin", 0, 131, 38, 24, 25)
        foodAtlas.add("sandwich", 0, 2, 76, 28, 16)
        foodAtlas.add("cake", 0, 32, 65, 32, 30)
        foodAtlas.add("burger", 0, 66, 65, 27, 27)
        
        // Текстуры кафе (интерьер)
        

        this.scene.start("CafeScene")
    }
}