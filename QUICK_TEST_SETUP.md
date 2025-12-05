# 快速測試設置指南 (5分鐘)

## 第一步：安裝依賴 (1分鐘)

在項目根目錄運行：

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest
```

## 第二步：更新package.json (1分鐘)

在 `package.json` 的 `scripts` 部分中添加以下行：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 第三步：檢查配置文件 (1分鐘)

以下文件已自動創建，無需修改：
- ✅ `jest.config.js` - Jest配置
- ✅ `jest.setup.js` - Jest全局設置
- ✅ `babel.config.js` - Babel配置

## 第四步：運行測試 (2分鐘)

### 執行所有測試
```bash
npm test
```

### 預期看到的結果：
```
 PASS  src/services/calculationService.test.js
  計算服務層 - calculationService
    calculateInventoryTurnoverScore - 存貨週轉率分數
      ✓ 應該為null或undefined輸入返回0
      ✓ 應該計算正常的存貨週轉率分數
      ✓ 應該計算低於基準的存貨週轉率分數
      ... (更多測試)

Test Suites: 1 passed, 1 total
Tests:       81 passed, 81 total
Time:        2.345 s
```

## 常用命令速查表

| 命令 | 說明 |
|------|------|
| `npm test` | 執行所有測試一次 |
| `npm test:watch` | 監視模式（自動重新運行） |
| `npm test:coverage` | 生成覆蓋率報告 |
| `npm test -- --testNamePattern="ROE"` | 只執行名稱匹配"ROE"的測試 |
| `npm test -- src/services/calculationService.test.js` | 只執行此文件的測試 |

## 如果遇到問題

### 問題1：找不到jest命令
**解決方案**：確保在安裝依賴後，使用 `npm test` 而不是直接運行 `jest`

### 問題2：模組找不到錯誤
**解決方案**：
```bash
# 清理node_modules並重新安裝
rm -rf node_modules
npm install
```

### 問題3：Babel配置錯誤
**解決方案**：確保 `babel.config.js` 和 `jest.config.js` 都存在於項目根目錄

## 成功標誌

當你看到以下輸出時，表示設置成功：

```
✓ All 81 tests passed!
✓ Test execution completed in ~2-3 seconds
✓ No coverage warnings
```

## 後續步驟

1. 閱讀 `TEST_COVERAGE.md` 了解詳細的測試覆蓋信息
2. 閱讀 `TESTING_GUIDE.md` 了解完整的測試指南
3. 在CI/CD流程中集成測試 (可選)

## 快速檢查清單

- [ ] 安裝了Jest和相關依賴
- [ ] 更新了package.json scripts
- [ ] 檢查了jest.config.js存在
- [ ] 檢查了babel.config.js存在
- [ ] 執行了npm test
- [ ] 看到所有81個測試都通過

完成以上步驟後，你就可以開始運行和維護測試了！
