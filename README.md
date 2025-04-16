# TeamUpQuick Shared Library

核心共享组件和工具函数，供TeamUpQuick微前端应用程序使用。

## 安装

```bash
npm install @teamupquick/shared
```

## 使用

### 基本使用

```jsx
import { formatDate, formatCurrency } from '@teamupquick/shared';

// Format a date
const formattedDate = formatDate(new Date()); // "2023-10-31"

// Format currency
const formattedAmount = formatCurrency(1000); // "NT$ 1,000"
```

### 常量和工具函数

```jsx
import { ROUTES, LOCAL_STORAGE_KEYS, API_URL } from '@teamupquick/shared';

// 使用路由常量
navigate(ROUTES.LOGIN);

// 使用本地存储键
localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);

// 使用API URL
fetch(`${API_URL}/users`);
```

## 最小化构建

我们提供了一个最小化版本，只包含基本工具函数，没有组件或复杂依赖关系。这对于只需要基本工具的项目很有用。

要仅构建最小版本:

```bash
npm run build:minimal
```

最小版本只包含:
- 基本的格式化工具函数 (formatDate, formatCurrency)
- 基本的路由常量 (ROUTES)
- 本地存储键 (LOCAL_STORAGE_KEYS)
- API URL常量

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
``` 