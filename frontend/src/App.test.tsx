import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
describe('Incident console',()=>{
 it('filters the queue and opens an incident',()=>{ render(<App/>); fireEvent.change(screen.getByLabelText('Filter by severity'),{target:{value:'Medium'}}); expect(screen.getByText('Public security group exposure')).toBeInTheDocument(); expect(screen.queryByText('GuardDuty cryptocurrency activity')).not.toBeInTheDocument() })
 it('assigns the selected incident to the analyst',()=>{ render(<App/>); fireEvent.click(screen.getByRole('button',{name:/assign to me/i})); expect(screen.getAllByText('Alex Rivera').length).toBeGreaterThan(1); expect(screen.getByLabelText('Incident status')).toHaveValue('Triaging') })
})
