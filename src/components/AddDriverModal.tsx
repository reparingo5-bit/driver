import { useState } from 'react'
import './Modal.css'

interface AddDriverModalProps {
  onClose: () => void;
  onAdd: (driver: { name: string; phone: string; email: string; status: 'Active' | 'Onboarding' }) => void;
}

export default function AddDriverModal({ onClose, onAdd }: AddDriverModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'Onboarding'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, phone, email, status });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Driver</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter driver name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="driver@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Active' | 'Onboarding')}
            >
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
