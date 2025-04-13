

// 從新位置導入類型以便向後兼容
import type {
  MilestoneMember,
  AddMilestoneMemberParams,
} from "../member/types";

// 重新導出這些類型以維持向後兼容
export type { MilestoneMember, AddMilestoneMemberParams };
