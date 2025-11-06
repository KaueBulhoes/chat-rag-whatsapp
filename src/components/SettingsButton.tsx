import { useState } from 'react'
import ConfigPanel from './ConfigPanel'
import {
    IconButton,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    CloseButton,
} from './SettingsButton.styles'

export default function SettingsButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton onClick={() => setIsOpen(true)} title="Abrir configurações">
                ⚙️
            </IconButton>

            {isOpen && (
                <ModalOverlay onClick={() => setIsOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h2>⚙️ Configurações do Sistema</h2>
                            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
                        </ModalHeader>
                        <ConfigPanel />
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    )
}