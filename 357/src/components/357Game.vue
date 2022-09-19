<template>
  <div class="lineup">
    <div id="blue_lineup">蓝方</div>
    <div class="blue_backpack">
      <img :src="store.state.imgsrc[item]" v-for="item in blueBackpack" />
    </div>
  </div>
  <div id="round" ref="lrd" class="red_background">{{ lineup_round }}回合</div>
  <div id="desk">
    <div
      v-for="(val, index) in [3, 5, 7]"
      class="piles"
      :id="pilesSelected === val ? 'piles_selected' : ''"
    >
      <div
        v-for="item in pilesArr[index]"
        :key="item"
        :ref="setRef"
        class="dice"
        @click="onclick(val, item)"
      >
        <img :src="store.state.imgsrc[item]" class="diceImg" />
      </div>
      <div v-if="pilesArr[index] == ''" class="empty">空</div>
    </div>
  </div>
  <div id="confirm">
    <button @click="confirm" id="button">确认拿走</button>
  </div>
  <div class="lineup">
    <div class="red_backpack">
      <img :src="store.state.imgsrc[item]" v-for="item in redBackpack" />
    </div>
    <div id="red_lineup">红方</div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="对局已完成"
    width="30%"
    :before-close="handleClose"
  >
    <span class="message">{{ message }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="again">再来一局</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
* {
  margin: 0 auto;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
#desk {
  width: 80rem;
  height: 36rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .piles {
    width: 22rem;
    height: 32rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 2.5rem;
    border-left: 0.2rem dashed black;
    border-right: 0.2rem dashed black;
    .dice_selected {
      background: #e9f3f3;
      box-shadow: 5px 5px 5px #888888;
    }
    .dice {
      width: 8rem;
      height: 7rem;
      .diceImg {
        max-height: 8rem;
        max-width: 7rem;
      }
    }
    .empty {
      font-size: 3rem;
    }
  }
  #piles_selected {
    background: #c8dfdf;
  }
}
#button {
  background-color: rgb(243, 216, 220);
}
.lineup {
  display: flex;
  line-height: 2.5rem;
  height: 2.5rem;
  font-size: 2rem;
  #blue_lineup {
    text-align: left;
    flex: 10%;
    background: rgb(0, 119, 255);
  }
  #red_lineup {
    text-align: right;
    flex: 10%;
    background: red;
  }
  .blue_backpack {
    height: 2.5rem;
    text-align: left;
    flex: 90%;
    background: linear-gradient(to left, transparent 50%, rgb(0, 119, 255));
  }
  .red_backpack {
    height: 2.5rem;
    text-align: right;
    flex: 90%;
    background: linear-gradient(to right, transparent 50%, red);
  }
  img {
    max-height: 2rem;
    margin-top: 0.25rem;
  }
}
#round {
  width: 10rem;
  height: 2rem;
  line-height: 2rem;
  font-size: 1.5rem;
}
.red_background {
  background: red;
}
.blue_background {
  background: rgb(0, 119, 255);
}
.message {
  font-size: 1.8rem;
}
</style>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, h } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import store from "../store";

const count = ref(15);
var round = 0;
const message = ref("");
const lineup_round = ref("");
const pilesSelected = ref(0);
const pilesArr: any[] = reactive([[]]);
const blueBackpack: number[] = reactive([]),
  redBackpack: number[] = reactive([]);
const lrd = ref(); //红/蓝方回合背景
const selectedDice: number[] = []; //已选择的骰子
const refs: any = ref([]),
  refList: any = ref([]);
const dialogVisible = ref(false); //对话框
const setRef = (el: any) => {
  if (el) {
    refList.value.push(el);
  }
};

const onclick = (pile: number, dice: number) => {
  //选择准备拿走的骰子
  pilesSelect(pile);
  diceSelect(refs.value[dice - 1], dice);
};

const diceSelect = (dom: any, dice: number) => {
  if (dom.classList[1] != "dice_selected") {
    dom.classList.add("dice_selected");
    selectedDice.push(dice);
  } else {
    dom.classList.remove("dice_selected");
    selectedDice.splice(selectedDice.indexOf(dice), 1);
  }
};

const pilesSelect = (piles: number) => {
  if (pilesSelected.value != piles && pilesSelected.value != 0) {
    let list = document.querySelectorAll(".dice_selected");
    list.forEach((item) => {
      item.classList.remove("dice_selected");
    });
    selectedDice.length = 0;
  }
  pilesSelected.value = piles;
};

const confirm = () => {
  //确认拿走骰子
  selectedDice.forEach((item) => {
    if (1 <= item && item <= 3) {
      //更新骰子
      pilesArr[0].splice(pilesArr[0].indexOf(item), 1);
      putInBackpack(item);
      count.value -= 1;
    } else if (4 <= item && item <= 8) {
      pilesArr[1].splice(pilesArr[1].indexOf(item), 1);
      putInBackpack(item);
      count.value -= 1;
    } else if (9 <= item && item <= 15) {
      pilesArr[2].splice(pilesArr[2].indexOf(item), 1);
      putInBackpack(item);
      count.value -= 1;
    }
  });
  pilesSelected.value = 0;
  round = (round + 1) % 2; //新回合
  lineup_round.value = round ? "蓝方" : "红方";
  switch (round) {
    case 0:
      lrd.value.classList.remove("blue_background");
      lrd.value.classList.add("red_background");
      break;
    case 1:
      lrd.value.classList.remove("red_background");
      lrd.value.classList.add("blue_background");
      break;
  }
  if (count.value == 0) {
    //判断当前对局是否已能分出胜负
    if (round == 0) {
      message.value = "红方胜";
      dialogVisible.value = true;
    } else {
      message.value = "蓝方胜";
      dialogVisible.value = true;
    }
  } else if (count.value == 1) {
    if (round == 0) {
      message.value = "蓝方胜";
      dialogVisible.value = true;
    } else {
      message.value = "红方胜";
      dialogVisible.value = true;
    }
  }
  selectedDice.length = 0;
};

const putInBackpack = (dice: number) => {
  //放入背包
  if (round) {
    blueBackpack.push(dice);
  } else {
    redBackpack.push(dice);
  }
};

const again = () => {
  //再来一局
  dialogVisible.value = false;
  refList.value = [];
  init();
  refs.value = refList.value;
};

const handleClose = (done: () => void) => {
  ElMessageBox({
    message: h("p", { style: "font-size:1.5rem" }, "要再来一局吗？"),
  })
    .then(() => {
      again();
      done();
    })
    .catch(() => {
      // catch error
    });
};

const init = () => {
  //初始化
  count.value = 15;
  blueBackpack.length = 0;
  redBackpack.length = 0;
  round = Math.floor(Math.random() * 2); //随机第一回合
  lineup_round.value = round ? "蓝方" : "红方";
  if (round) {
    lrd.value.classList.remove("red_background");
    lrd.value.classList.add("blue_background");
  } else {
    lrd.value.classList.remove("blue_background");
    lrd.value.classList.add("red_background");
  }
  pilesSelected.value = 0;
  pilesArr.length = 0;
  pilesArr.push([1, 2, 3], [4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15]);
};

onMounted(() => {
  init();
  refs.value = refList.value;
});
</script>