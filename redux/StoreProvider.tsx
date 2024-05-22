'use client'

import { Provider } from 'react-redux'

import { persistStore } from 'redux-persist'
import { store } from './store'

persistStore(store)

export default function StoreProvider({ children }: { children: React.ReactNode }) {
	// const storeRef = useRef<RootState>()
	// if (!storeRef.current) {
	// 	// Create the store instance the first time this renders
	// 	storeRef.current = store
	// }
	return <Provider store={store}>{children}</Provider>
}
