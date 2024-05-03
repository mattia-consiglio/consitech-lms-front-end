import { CustomFlowbiteTheme } from 'flowbite-react'

export const customTabsTheme: CustomFlowbiteTheme['tabs'] = {
	tablist: {
		tabitem: {
			base: 'flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary_lighter dark:focus:ring-primary_darker disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500',
			styles: {
				default: {
					base: 'rounded-none',
					active: {
						on: 'bg-neutral-100 text-primary_darker dark:bg-neutral-800 dark:text-primary',
						off: 'border-b-2 border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300',
					},
				},
			},
		},
	},
}
export const customButtonTheme: CustomFlowbiteTheme['button'] = {
	// 'label':
	// 	'ml-2 inline-flex h-4 w-4 items-center justify-center rounded-none bg-cyan-200 text-xs font-semibold text-cyan-800',
	outline: {
		color: {
			default:
				'rounded-none border-primary enabled:hover:bg-primary dark:enabled:hover:bg-primary focus:bg-primary focus:ring-0  focus-visible:bg-primary bg-primary hover:bg-primary dark:bg-primary',
		},
		on: 'flex w-full justify-center bg-white text-invert_light transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0  group-enabled:group-focus-visible:bg-opacity-0 group-enabled:group-focus-visible:text-white group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white',
		pill: {
			off: 'rounded-none',
		},
	},
	pill: {
		off: 'rounded-none',
	},
}
