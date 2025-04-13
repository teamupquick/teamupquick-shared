# TeamUpQuick Shared

TeamUpQuick 專案的共享元件和工具庫。此模組包含可以被所有其他微前端模組共用的元件、工具函數、鉤子和 API 客戶端。

## 內容

- UI 元件
- 工具函數
- 自定義 Hooks
- API 客戶端
- 共享類型

## 安裝

```bash
npm install @teamupquick/shared
```

## 使用方式

```tsx
import { Button, Card } from '@teamupquick/shared/components';
import { formatDate } from '@teamupquick/shared/utils';
import { useAuth } from '@teamupquick/shared/hooks';
import { apiClient } from '@teamupquick/shared/api';
```

## 開發

### 構建專案

```bash
npm run build
```

### 執行測試

```bash
npm test
``` 