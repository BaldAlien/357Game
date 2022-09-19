import { createStore } from 'vuex';

// Create a new store instance.
const store = createStore({
    state() {
        return {
            imgsrc: {
                1: "../src/assets/images/dice_1.png",
                2: "../src/assets/images/dice_2.png",
                3: "../src/assets/images/dice_3.png",
                4: "../src/assets/images/dice_4.png",
                5: "../src/assets/images/dice_5.png",
                6: "../src/assets/images/dice_6.png",
                7: "../src/assets/images/dice_7.png",
                8: "../src/assets/images/dice_8.png",
                9: "../src/assets/images/dice_9.png",
                10: "../src/assets/images/dice_10.png",
                11: "../src/assets/images/dice_11.png",
                12: "../src/assets/images/dice_12.png",
                13: "../src/assets/images/dice_1.png",
                14: "../src/assets/images/dice_2.png",
                15: "../src/assets/images/dice_3.png",
            }
        };
    },
    mutations: {

    },
});

export default store;
