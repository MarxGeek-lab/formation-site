// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import calendarReducer from '@/redux-store/slices/calendar'
import chatReducer from '@/redux-store/slices/chat'
import emailReducer from '@/redux-store/slices/email'
import kanbanReducer from '@/redux-store/slices/kanban'

export const store = configureStore({
  reducer: {
    chatReducer,
    calendarReducer,
    kanbanReducer,
    emailReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})
