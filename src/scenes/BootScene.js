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
        cafeAtlas.add("counter", 0, 0, 0, 64, 16)
        cafeAtlas.add("bar_chair", 0, 68, 1, 8, 14)
        cafeAtlas.add("table", 0, 84, 3, 24, 26)
        cafeAtlas.add("chair", 0, 68, 16, 9, 16)
        cafeAtlas.add("chair_right_side", 0, 115, 0, 12, 16)
        cafeAtlas.add("chair_left_side", 0, 113, 16, 12, 16)
        cafeAtlas.add("chair_back", 0, 148, 20, 9, 12)
        cafeAtlas.add("sofa", 0, 129, 1, 30, 15)
        cafeAtlas.add("shelf", 0, 161, 2, 30, 11)
        cafeAtlas.add("shelf_2", 0, 129, 17, 14, 15)
        cafeAtlas.add("mini_shelf", 0, 161, 2, 30, 4)
        cafeAtlas.add("rag", 0, 163, 21, 9, 7)
        cafeAtlas.add("cover", 0, 17, 22, 14, 8)
        cafeAtlas.add("table_with_computer", 0, 32, 24, 32, 24)
        cafeAtlas.add("trash_bucket", 0, 180, 18, 8, 14)
        cafeAtlas.add("trash_bucket_2", 0, 129, 32, 14, 16)
        cafeAtlas.add("clothes_hanger", 0, 2, 19, 13, 29)
        cafeAtlas.add("small_cup", 0, 16, 32, 6, 5)
        cafeAtlas.add("bit_cup", 0, 16, 39, 6, 6)
        cafeAtlas.add("plant", 0, 66, 32, 12, 15)
        cafeAtlas.add("picture", 0, 81, 33, 14, 15)
        cafeAtlas.add("candle", 0, 117, 32, 6, 13)
        cafeAtlas.add("bucket_with_umbrella", 0, 146, 32, 9, 16)
        cafeAtlas.add("bucket_without_umbrella", 0, 144, 64, 9, 16)
        cafeAtlas.add("stand_for_cups", 0, 65, 65, 14, 11)
        cafeAtlas.add("stand_for_plates", 0, 49, 65, 14, 11)
        cafeAtlas.add("sink", 0, 1, 65, 14, 14)
        cafeAtlas.add("tumper", 0, 51, 56, 10, 3)
        cafeAtlas.add("scales", 0, 32, 48, 16, 16)
        cafeAtlas.add("coffee_maker", 0, 1, 48, 15, 16)
        cafeAtlas.add("coffee_grinder", 0, 19, 48, 11, 16)
        cafeAtlas.add("pitcher", 0, 19, 64, 9, 16)
        cafeAtlas.add("garland", 0, 64, 49, 16, 6)
        cafeAtlas.add("garland_2", 0, 80, 49, 16, 6)
        cafeAtlas.add("clock", 0, 98, 49, 12, 13)
        cafeAtlas.add("menu", 0, 113, 48, 14, 16)
        cafeAtlas.add("tray", 0, 128, 52, 16, 10)
        cafeAtlas.add("mop", 0, 152, 48, 8, 16)

        cafeAtlas.add("wall", 0, 176, 48, 16, 32)
        cafeAtlas.add("floor", 0, 160, 48, 16, 16)
        

        this.scene.start("CafeScene")
    }
}