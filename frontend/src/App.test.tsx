import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

describe('Incident console', () => {
  it('filters the queue by severity and selects the matching incident', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Filter by severity'), { target: { value: 'Medium' } })
    expect(screen.getAllByText('Public security group exposure')).toHaveLength(2)
    expect(screen.queryByText('GuardDuty cryptocurrency activity')).not.toBeInTheDocument()
  })

  it('assigns the selected incident to the analyst and acknowledges it', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /assign to me/i }))
    const details = screen.getByRole('article')
    expect(within(details).getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByLabelText('Incident status')).toHaveValue('Acknowledged')
    expect(screen.getByRole('status')).toHaveTextContent('Incident assigned to you')
  })

  it('preserves the sender-specified severity and exposes the original email metadata', () => {
    render(<App />)
    expect(screen.getByText('Sender specified')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Original email' }))
    expect(screen.getByText('Sender validated ✓')).toBeInTheDocument()
    expect(screen.getByText(/AAQkAGU4/)).toBeInTheDocument()
  })
})
