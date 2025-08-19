export const sidebarUtils = {
  getSidebarState: (): boolean => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  },

  setSidebarState: (collapsed: boolean): void => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }
};