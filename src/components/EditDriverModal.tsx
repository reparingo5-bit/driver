import { useState } from 'react'
import './Modal.css'

interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'Active' | 'Onboarding';
}

interface EditDriverModalProps {
  driver: Driver;
  onClose: () => void;
  onSave: (id: number, driver: { name: string; phone: string; email: string; status: 'Active' | 'Onboarding' }) => void;
}

export default function EditDriverModal({ driver, onClose, onSave }: EditDriverModalProps) {
  const [name, setName] = useState(driver.name);
  const [phone, setPhone] = useState(driver.phone);
  const [email, setEmail] = useState(driver.email);
  const [status, setStatus] = useState<'Active' | 'Onboarding'>(driver.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(driver.id, { name, phone, email, status });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Driver</h2>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
