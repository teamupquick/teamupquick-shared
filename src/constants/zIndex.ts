/**
 * Z-Index 層級常數
 * 層級數字越大，顯示越靠前
 */

export const Z_INDEX = {
  // Layer1 (1-99): 背景元素
  LAYER1: {
    BACKGROUND: 1,
    BACKGROUND_DECORATION: 10,
    CONTENT_BASE: 50,
  },

  // Layer2 (100-999): 基本UI元素
  LAYER2: {
    PAGE: 100,
    HEADER: 200,
    NAVIGATION: 300,
    SIDEBAR: 400,
    FOOTER: 500,
  },

  // Layer3 (1000-4999): 頁面內覆蓋元素
  LAYER3: {
    PAGE: 1000,
    BACKDROP: 2000,
    SPEED_DIAL: 3000,
    DRAWER: 4000,
  },

  // Layer4 (5000-9999): 對話框和模態框
  LAYER4: {
    PAGE: 5000,
    DIALOG_BACKDROP: 6000,
    MODAL: 7000,
  },

  // Layer5 (10000-19999): 下拉選單和彈出元素
  LAYER5: {
    PAGE: 10000,
    DROPDOWN: 11000,
    AUTOCOMPLETE: 12000,
    TOOLTIP: 13000,
  },

  // Layer6 (20000+): 全局通知和最高優先級元素
  LAYER6: {
    POPPER: 20000,
    NOTIFICATION: 21000,
    TOAST: 22000,
    LOADING: 30000,
  },
};

export default Z_INDEX;
