import { useState } from 'react'
import ConfigPanel from './ConfigPanel'
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    CloseButton,
    SettingsButton,
} from './SettingsModal.styles'

export default function SettingsModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <SettingsButton onClick={() => setIsOpen(true)} title="Abrir configurações">
                ⚙️
            </SettingsButton>

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