import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(9, 12, 16, 0.4);
`

export const DialogPanel = styled.div`
  width: min(28rem, 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.raised};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.inkStrong};
`

export const DialogMessage = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.ink};
`

export const DialogActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

export const DestructiveButtonWrap = styled.span`
  && button {
    background: ${({ theme }) => theme.colors.warning};
    border-color: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.surface};

    &:hover:not(:disabled) {
      filter: brightness(0.95);
    }
  }
`
