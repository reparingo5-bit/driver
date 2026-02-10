import { useState, useEffect } from 'react'
import DriverList from './DriverList'
import AddDriverModal from './AddDriverModal'
import EditDriverModal from './EditDriverModal'
import './Dashboard.css'

interface Admin {
  id: number;
  email: string;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'Active' | 'Onboarding';
  created_at: string;
}

interface DashboardProps {
  admin: Admin;
  onLogout: () => void;
}

export default function Dashboard({ admin, onLogout }: DashboardProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Alle');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [drivers, statusFilter]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers');
      const data = await response.json();
      setDrivers(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (statusFilter === 'Alle') {
      setFilteredDrivers(drivers);
    } else {
      setFilteredDrivers(drivers.filter(d => d.status === statusFilter));
    }
  };

  const handleAddDriver = async (newDriver: Omit<Driver, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver)
      });

      if (response.ok) {
        const driver = await response.json();
        setDrivers([driver, ...drivers]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Failed to add driver:', err);
    }
  };

  const handleEditDriver = async (id: number, updatedDriver: Omit<Driver, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDriver)
      });

      if (response.ok) {
        const driver = await response.json();
        setDrivers(drivers.map(d => d.id === id ? driver : d));
        setEditDriver(null);
      }
    } catch (err) {
      console.error('Failed to update driver:', err);
    }
  };

  const handleDeleteDriver = async (id: number) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDrivers(drivers.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete driver:', err);
    }
  };

  const getStatusCount = (status: string) => {
    if (status === 'Alle') return drivers.length;
    return drivers.filter(d => d.status === status).length;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Driver Dashboard</h1>
          <div className="header-actions">
            <span className="admin-email">{admin.email}</span>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-controls">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === 'Alle' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Alle')}
            >
              Alle ({getStatusCount('Alle')})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'Active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Active')}
            >
              Active ({getStatusCount('Active')})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'Onboarding' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Onboarding')}
            >
              Onboarding ({getStatusCount('Onboarding')})
            </button>
          </div>

          <button onClick={() => setShowAddModal(true)} className="add-driver-button">
            + Add Driver
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading drivers...</div>
        ) : (
          <DriverList
            drivers={filteredDrivers}
            onEdit={setEditDriver}
            onDelete={handleDeleteDriver}
          />
        )}
      </main>

      {showAddModal && (
        <AddDriverModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDriver}
        />
      )}

      {editDriver && (
        <EditDriverModal
          driver={editDriver}
          onClose={() => setEditDriver(null)}
          onSave={handleEditDriver}
        />
      )}
    </div>
  );
}
