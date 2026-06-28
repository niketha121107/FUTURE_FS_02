import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Dashboard() {
  const [allLeads, setAllLeads] = useState([]);
  const [displayedLeads, setDisplayedLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', source: 'website', status: 'new', message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchAllLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setAllLeads(data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
        return;
      }
    }
  };

  const fetchDisplayedLeads = async (searchVal, statusVal) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (statusVal) params.status = statusVal;
      const { data } = await api.get('/leads', { params });
      setDisplayedLeads(data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeads();
  }, []);

  useEffect(() => {
    fetchDisplayedLeads(search, statusFilter);
  }, [search, statusFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
    }, 400);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(leadId));
    try {
      const { data } = await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      setDisplayedLeads((prev) =>
        prev.map((l) => (l._id === leadId ? data : l))
      );
      setAllLeads((prev) =>
        prev.map((l) => (l._id === leadId ? data : l))
      );
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
        return;
      }
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(leadId);
        return next;
      });
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Invalid email format';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    setSaving(true);
    try {
      const body = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        source: formData.source,
        status: formData.status,
      };
      if (formData.message.trim()) body.message = formData.message.trim();

      await api.post('/leads', body);
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', source: 'website', status: 'new', message: '' });
      setFormErrors({});
      fetchAllLeads();
      fetchDisplayedLeads(search, statusFilter);
      showToast('Lead created successfully.');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: allLeads.length,
    new: allLeads.filter((l) => l.status === 'new').length,
    contacted: allLeads.filter((l) => l.status === 'contacted').length,
    converted: allLeads.filter((l) => l.status === 'converted').length,
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <span className="stat-label">Total</span>
          <span className="stat-number">{stats.total}</span>
        </div>
        <div className="stat-card stat-new">
          <span className="stat-label">New</span>
          <span className="stat-number">{stats.new}</span>
        </div>
        <div className="stat-card stat-contacted">
          <span className="stat-label">Contacted</span>
          <span className="stat-number">{stats.contacted}</span>
        </div>
        <div className="stat-card stat-converted">
          <span className="stat-label">Converted</span>
          <span className="stat-number">{stats.converted}</span>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            defaultValue=""
            onChange={handleSearchChange}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
        <button className="btn-add-lead" onClick={() => setShowAddModal(true)}>
          + Add Lead
        </button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {loading ? (
        <p className="dashboard-message">Loading leads...</p>
      ) : displayedLeads.length === 0 ? (
        <p className="dashboard-message">No leads found</p>
      ) : (
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayedLeads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.source}</td>
                <td>
                  {updatingIds.has(lead._id) ? (
                    <span className="updating-spinner">updating...</span>
                  ) : (
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                  )}
                </td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/leads/${lead._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Lead</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddLead} noValidate>
              {submitError && <p className="form-error">{submitError}</p>}

              <label>
                Name <span className="required">*</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </label>

              <label>
                Email <span className="required">*</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </label>

              <label>
                Phone
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>

              <label>
                Source
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="phone_call">Phone Call</option>
                  <option value="walk-in">Walk-in</option>
                  <option value="manual">Manual</option>
                </select>
              </label>

              <label>
                Status
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </label>

              <label>
                Message
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
