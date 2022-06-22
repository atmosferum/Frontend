import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Dialog } from './Dialog'
import { Button } from '../Button'

export default {
	title: 'Dialog',
	component: Dialog,
} as ComponentMeta<typeof Dialog>

export const DialogStory: ComponentStory<typeof Dialog> = (args) => {
	return <>
        <Dialog
			trigger={<Button>Открыть модальное окно</Button>}
		>
			hi
		</Dialog>
	</>
}
