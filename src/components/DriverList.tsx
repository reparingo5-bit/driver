import './DriverList.css'

interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'Active' | 'Onboarding';
  created_at: string;
}

interface DriverListProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: number) => void;
}

export default function DriverList({ drivers, onEdit, onDelete }: DriverListProps) {
  if (drivers.length === 0) {
    return (
      <div className="empty-state">
        <p>No drivers found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="driver-table-container">
        <table className="driver-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.email}</td>
                <td>
                  <span className={`status-badge ${driver.status.toLowerCase()}`}>
                    {driver.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(driver)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => onDelete(driver.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="driver-cards">
        {drivers.map((driver) => (
          <div key={driver.id} className="driver-card">
            <div className="card-header">
              <h3>{driver.name}</h3>
              <span className={`status-badge ${driver.status.toLowerCase()}`}>
                {driver.status}
              </span>
            </div>
            <div className="card-body">
              <div className="card-info">
                <span className="label">Phone:</span>
                <span>{driver.phone}</span>
              </div>
              <div className="card-info">
                <span className="label">Email:</span>
                <span>{driver.email}</span>
              </div>
            </div>
            <div className="card-actions">
              <button onClick={() => onEdit(driver)} className="edit-button">
                Edit
              </button>
              <button onClick={() => onDelete(driver.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
