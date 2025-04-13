/**
 * 自動生成角色類型代碼
 * @param name 角色類型名稱
 * @returns 自動生成的代碼
 */
export function generateRoleTypeCode(name: string): string {
  return name.trim().toUpperCase().replace(/ /g, "_");
}
