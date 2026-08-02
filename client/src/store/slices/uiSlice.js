import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    darkMode: true,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebar: (state, action) => { state.sidebarOpen = action.payload },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode },
  },
})

export const { toggleSidebar, setSidebar, toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer
